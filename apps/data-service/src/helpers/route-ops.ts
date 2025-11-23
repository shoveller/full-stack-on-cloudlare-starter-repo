import { getLink } from "@repo/data-ops/queries/links";
import {linkSchema, LinkSchemaType} from "@repo/data-ops/zod/links";

// 캐시에서 링크를 가져오거나 저장한다.
const linkInfoInKV = {
	// 캐시의 데이터를 반환한다. 없으면 null을 반환한다
	get: async (env: Env, id: string) => {
		const linkInfoStr = await env.CACHE.get(id);
		console.log('linkInfoStr', linkInfoStr)
		if (!linkInfoStr) {
			return null;
		}

		try {
			// KV의 값은 문자열로 직렬화된 상태이므로 역직렬화 필요
			const parsedLinkInfo = JSON.parse(linkInfoStr);
			return linkSchema.parse(parsedLinkInfo);
		} catch (error) {
			console.error(`[KV Parse Error] Failed to parse link info for id: ${id}`, error);
			return null;
		}
	},
	// 캐시에 데이터를 기록한다. 유효기간은 하루
	set: async (env: Env, id: string, linkInfo: LinkSchemaType) => {
		try {
			await env.CACHE.put(id, JSON.stringify(linkInfo), {
				expirationTtl: 60 * 60 * 24, // 1day
			});
		} catch (e) {
			console.error('Error saving link info to KV:', e);
		}
	}
}

export const getRoutingDestinations = async (env: Env, id: string) => {
	const linkInfo = await linkInfoInKV.get(env, id)
	if (linkInfo) {
		return linkInfo
	}

	const linkInfoFromDB = await getLink(id)
	if (linkInfoFromDB) {
		await linkInfoInKV.set(env, id, linkInfoFromDB)
		return linkInfoFromDB
	}

	return null
}


// 접속국가에 맞는 url을 반환한다
export const getDestinationForCountry = (linkInfo: LinkSchemaType, countryCode?: string) => {
	if (countryCode && linkInfo.destinations[countryCode]) {
		return linkInfo.destinations[countryCode]
	}

	return linkInfo.destinations.default
}
