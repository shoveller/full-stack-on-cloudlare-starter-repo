import {CreateLinkSchemaType, destinationsSchema, DestinationsSchemaType, linkSchema} from "@/zod/links";
import {getDb} from "@/db/database";
import {nanoid} from "nanoid";
import {links} from "@/drizzle-out/schema";
import {and, desc, eq, gt} from "drizzle-orm";

/**
 * 새로운 링크를 생성합니다.
 * @param {CreateLinkSchemaType & { accountId: string }} data - 링크 생성에 필요한 데이터와 계정 ID.
 * @returns {Promise<string>} 생성된 링크의 ID.
 */
// accountId 를 CreateLinkSchemaType 에서 제외했기 때문
export const createLink = async (data: CreateLinkSchemaType & { accountId: string }) => {
    const db = getDb()
    const linkId = nanoid()
    // drizzle 스키마를 insert 함수에 넘긴다
    await db.insert(links).values({
        linkId,
        accountId: data.accountId,
        name: data.name,
        destinations: JSON.stringify(data.destinations),
    })

    return linkId
}

/**
 * 특정 계정 ID에 대한 링크 목록을 가져옵니다. 커서 기반 페이지네이션을 지원합니다.
 * @param {string} accountId - 링크를 조회할 계정의 ID.
 * @param {string} [createdBefore] - 페이지네이션을 위한 커서. 이 시간 이전에 생성된 링크를 가져옵니다.
 * @returns {Promise<object[]>} 링크 목록.
 */
// 특정 계정 ID에 대한 링크를 검색. 커서기반 페이지네이션이 구현되어 있다.
export const getLinks = async (accountId: string, createdBefore?: string) => {
    const db = getDb()
    const conditions = [eq(links.accountId, accountId)]

    // 커서 기반 페이지네이션 구현!
    if (createdBefore) {
        conditions.push(gt(links.created, createdBefore))
    }

    const result = await db.select({
        linkId: links.linkId, // link_id as linkId
        destinations: links.destinations,
        created: links.created,
        name: links.name,
    }).from(links).where(and(...conditions)).orderBy(desc(links.created)).limit(25)

    return result.map((link) => {
        const lastSixHours = Array.from({ length: 6 }, () => {
            return Math.floor(Math.random() * 100)
        })

        return {
            ...link,
            lastSixHours,
            linkClicks: 6,
            destinations: Object.keys(JSON.parse(link.destinations)).length
        }
    })
}

/**
 * 링크의 이름을 수정합니다.
 * @param {string} linkId - 수정할 링크의 ID.
 * @param {string} name - 새로운 링크 이름.
 * @returns {Promise<void>}
 */
// 링크의 이름을 수정
export const updateLinkName = async (linkId: string, name: string) => {
    const db = getDb()
    await db.update(links).set({
        name,
        updated: new Date().toISOString()
    }).where(eq(links.linkId, linkId))
}

/**
 * 단일 링크 정보를 가져옵니다.
 * @param {string} linkId - 조회할 링크의 ID.
 * @returns {Promise<object|null>} 링크 정보 객체. 링크가 없으면 null을 반환합니다.
 */
// 단일 링크를 취득
export const getLink = async (linkId: string) => {
    const db = getDb()
    // 단일 링크라도 반환값은 항상 배열
    const result = await db.select().from(links).where(eq(links.linkId, linkId)).limit(1)

    if (!result.length) {
        return null
    }

    const link = result[0]
    // 링크를 검증
    const parsedLink = linkSchema.safeParse(link)
    if (!parsedLink.success) {
        console.log(parsedLink.error)
        throw new Error('잘못된 링크')
    }

    return parsedLink.data
}

/**
 * 링크의 목적지를 수정합니다.
 * @param {string} linkId - 수정할 링크의 ID.
 * @param {DestinationsSchemaType} destinations - 새로운 목적지 정보.
 * @returns {Promise<void>}
 */
export const updateLinkDestinations = async (linkId: string, destinations: DestinationsSchemaType) => {
    const destinationParsed = destinationsSchema.parse(destinations)
    const db = getDb()
    await db.update(links).set({
        destinations: JSON.stringify(destinationParsed),
        updated: new Date().toISOString()
    }).where(eq(links.linkId, linkId))
}
