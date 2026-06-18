const { Client } = require("@notionhq/client")

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

module.exports = async (req, res) => {
  try {
    const db = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
    })

    const items = db.results.map((page, i) => {
      return {
        title: page.properties?.Name?.title?.[0]?.plain_text || "",

        image:
          page.properties?.Cover?.files?.[0]?.file?.url ||
          page.properties?.Cover?.files?.[0]?.external?.url ||
          page.properties?.Cover?.url ||
          "",

        description:
          page.properties?.Description?.rich_text?.[0]?.plain_text || "",

        tags:
          page.properties?.Tags?.multi_select?.map((t) => t.name) || [],

        url: page.properties?.URL?.url || "",

        x: (i % 6) * 700 + 300,
        y: Math.floor(i / 6) * 700 + 300,
      }
    })

    res.status(200).json(items)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
