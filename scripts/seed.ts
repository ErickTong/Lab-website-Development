import { db } from '../src/lib/db'

async function main() {
  // Create default categories
  const categories = [
    { name: '研究动态', description: '实验室最新研究进展', color: '#10b981' },
    { name: '学术成果', description: '发表的论文和研究成果', color: '#3b82f6' },
    { name: '团队新闻', description: '团队活动和新闻', color: '#f59e0b' },
    { name: '通知公告', description: '重要通知和公告', color: '#ef4444' },
    { name: '学术交流', description: '学术会议和交流活动', color: '#8b5cf6' }
  ]

  for (const category of categories) {
    const slug = category.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    await db.category.upsert({
      where: { slug },
      update: {},
      create: {
        name: category.name,
        slug,
        description: category.description,
        color: category.color
      }
    })
  }

  console.log('Default categories created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })