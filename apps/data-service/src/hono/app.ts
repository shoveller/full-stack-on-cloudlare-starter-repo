import { cloudflareInfoSchema } from "@repo/data-ops/zod/links";
import {Hono} from "hono";
import {getDestinationForCountry, getRoutingDestinations} from "@/helpers/route-ops";

export const App = new Hono<{ Bindings: Env }>()

App.get('/:linkId', async (c) => {
	const linkId = c.req.param('linkId')
	const linkInfo = await getRoutingDestinations(c.env, linkId)
	if (!linkInfo) {
		return c.text('목적지가 없습니다.', 404)
	}

	const chHeader = cloudflareInfoSchema.safeParse(c.req.raw.cf)
	if (chHeader.error) {
		return c.text('클라우드 플레어 헤더 이상', 400)
	}

	const destination = getDestinationForCountry(linkInfo, chHeader.data.country)
	return c.redirect(destination)
})
