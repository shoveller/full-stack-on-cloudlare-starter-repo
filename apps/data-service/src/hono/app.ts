import { getLink } from "@repo/data-ops/queries/links";
import {Hono} from "hono";

export const App = new Hono<{ Bindings: Env }>()

App.get('/:linkId', async (c) => {
	const linkId = c.req.param('linkId')
	const linkInfoFromDb = await getLink(linkId)

	return c.json(linkInfoFromDb)
})
