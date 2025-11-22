import {CreateLinkSchemaType} from "@/zod/links";
import {getDb} from "@/db/database";
import {nanoid} from "nanoid";
import {links} from "@/drizzle-out/schema";

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