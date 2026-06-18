const { Client } = require("@notionhq/client")

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

module.exports = async (req, res) => {
  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  })

  const projects = response.results.map((page) => ({
    title: page.properties.Name?.title?.[0]?.plain_text || "",
    description: page.properties.Description?.rich_text?.[0]?.plain_text || "",
    image:
      page.properties.Cover?.files?.[0]?.file?.url ||
      page.properties.Cover?.files?.[0]?.external?.url ||
      "",
    url: page.properties.URL?.url || "",
  }))

  res.status(200).json(projects)
}
