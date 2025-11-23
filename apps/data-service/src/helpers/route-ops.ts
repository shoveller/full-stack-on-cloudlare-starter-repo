import { LinkSchemaType } from "@repo/data-ops/zod/links";

// 접속국가에 맞는 url을 반환한다
export const getDestinationForCountry = (linkInfo: LinkSchemaType, countryCode?: string) => {
	if (countryCode && linkInfo.destinations[countryCode]) {
		return linkInfo.destinations[countryCode]
	}

	return linkInfo.destinations.default
}
