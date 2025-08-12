import { db } from '../src/lib/db'
import bcrypt from 'bcryptjs'

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await db.user.upsert({
    where: { email: 'admin@lab.com' },
    update: {},
    create: {
      email: 'admin@lab.com',
      username: 'admin',
      password: adminPassword,
      name: '管理员',
      role: 'ADMIN',
      bio: '系统管理员账户'
    }
  })

  // Create editor user
  const editorPassword = await bcrypt.hash('editor123', 12)
  const editor = await db.user.upsert({
    where: { email: 'editor@lab.com' },
    update: {},
    create: {
      email: 'editor@lab.com',
      username: 'editor',
      password: editorPassword,
      name: '编辑员',
      role: 'EDITOR',
      bio: '内容编辑员'
    }
  })

  // Create default categories
  const categories = await Promise.all([
    db.category.upsert({
      where: { name: '新闻动态' },
      update: {},
      create: {
        name: '新闻动态',
        slug: 'news',
        description: '实验室最新新闻和动态',
        color: '#3B82F6'
      }
    }),
    db.category.upsert({
      where: { name: '研究成果' },
      update: {},
      create: {
        name: '研究成果',
        slug: 'research',
        description: '最新研究成果和论文',
        color: '#10B981'
      }
    }),
    db.category.upsert({
      where: { name: '学术活动' },
      update: {},
      create: {
        name: '学术活动',
        slug: 'activities',
        description: '学术会议和研讨会',
        color: '#F59E0B'
      }
    }),
    db.category.upsert({
      where: { name: '团队建设' },
      update: {},
      create: {
        name: '团队建设',
        slug: 'team',
        description: '团队成员和发展',
        color: '#EF4444'
      }
    })
  ])

  // Create team members
  const teamMembers = await Promise.all([
    db.teamMember.create({
      data: {
        name: '李教授',
        title: '实验室主任 / 博士生导师',
        bio: '从事果树发育生物学研究20余年，在旱区果树抗逆机制研究方面取得重要成果。',
        research: '果树发育生物学、旱区果树抗逆机制',
        education: '博士，果树学专业',
        email: 'li.prof@lab.com',
        order: 1,
        active: true
      }
    }),
    db.teamMember.create({
      data: {
        name: '王教授',
        title: '副主任 / 硕士生导师',
        bio: '专注于果树分子生物学和遗传育种研究，主持多项国家级科研项目。',
        research: '分子生物学、遗传育种',
        education: '博士，分子生物学专业',
        email: 'wang.prof@lab.com',
        order: 2,
        active: true
      }
    }),
    db.teamMember.create({
      data: {
        name: '张博士',
        title: '副研究员',
        bio: '研究方向为果树生理生态学，在果树抗旱生理机制研究方面经验丰富。',
        research: '果树生理生态学、抗旱生理机制',
        education: '博士，生态学专业',
        email: 'zhang.dr@lab.com',
        order: 3,
        active: true
      }
    }),
    db.teamMember.create({
      data: {
        name: '刘博士',
        title: '助理研究员',
        bio: '从事果树基因组学和生物信息学研究，在果树功能基因研究方面有突出贡献。',
        research: '果树基因组学、生物信息学',
        education: '博士，基因组学专业',
        email: 'liu.dr@lab.com',
        order: 4,
        active: true
      }
    })
  ])

  // Create sample publications
  const publications = await Promise.all([
    db.publication.create({
      data: {
        title: '旱区果树抗旱分子机制研究',
        abstract: '本研究深入探讨了旱区果树在干旱胁迫下的分子响应机制，发现了一系列关键抗旱基因...',
        authors: '李教授, 王教授, 张博士',
        journal: 'Plant Physiology',
        year: 2024,
        volume: '185',
        issue: '2',
        pages: '345-360',
        doi: '10.1104/pp.123.456',
        authorId: admin.id
      }
    }),
    db.publication.create({
      data: {
        title: '果树基因组学在抗旱育种中的应用',
        abstract: '通过基因组学技术，我们成功鉴定了多个与抗旱性相关的QTL位点，为果树抗旱育种提供了新的思路...',
        authors: '王教授, 刘博士',
        journal: 'Nature Plants',
        year: 2023,
        volume: '9',
        issue: '12',
        pages: '1567-1582',
        doi: '10.1038/s41477-023-01567-8',
        authorId: editor.id
      }
    })
  ])

  // Create sample research projects
  const projects = await Promise.all([
    db.researchProject.create({
      data: {
        title: '旱区果树抗逆分子机制研究',
        description: '深入研究旱区果树在干旱、盐碱等逆境条件下的分子响应机制，筛选关键抗逆基因',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2025-12-31'),
        status: 'ACTIVE',
        funding: '国家自然科学基金',
        budget: 1500000,
        authorId: admin.id
      }
    }),
    db.researchProject.create({
      data: {
        title: '果树抗旱分子标记开发与应用',
        description: '开发与抗旱性状相关的分子标记，应用于果树分子标记辅助育种',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2026-12-31'),
        status: 'ACTIVE',
        funding: '国家重点研发计划',
        budget: 2000000,
        authorId: editor.id
      }
    }),
    db.researchProject.create({
      data: {
        title: '旱区果树种质资源评价与创新利用',
        description: '系统评价旱区果树种质资源，创制优良新种质，为果树育种提供材料基础',
        startDate: new Date('2022-01-01'),
        endDate: new Date('2024-12-31'),
        status: 'COMPLETED',
        funding: '农业部重点课题',
        budget: 800000,
        authorId: admin.id
      }
    })
  ])

  // Create sample posts
  const posts = await Promise.all([
    db.post.create({
      data: {
        title: '实验室获得国家自然科学基金重点项目资助',
        slug: 'nsfc-funding-2024',
        content: `我实验室申报的"旱区果树抗逆分子机制研究"项目获得国家自然科学基金重点项目资助，资助金额为150万元。

该项目为期3年，将深入研究旱区果树在干旱胁迫下的分子响应机制，筛选关键抗逆基因，为旱区果树抗逆育种提供理论基础和技术支持。

项目负责人为李教授，团队成员包括王教授、张博士等。这是实验室在果树抗逆研究领域的又一重要突破。`,
        excerpt: '我实验室申报的"旱区果树抗逆分子机制研究"项目获得国家自然科学基金重点项目资助...',
        published: true,
        publishedAt: new Date('2024-01-15'),
        authorId: admin.id,
        categoryId: categories[0].id
      }
    }),
    db.post.create({
      data: {
        title: '研究成果在国际顶级期刊发表',
        slug: 'plant-physiology-publication',
        content: `李教授团队在《Plant Physiology》发表重要研究成果，揭示了果树抗旱的新机制。

该研究通过转录组和代谢组分析，发现了一系列在干旱胁迫下差异表达的基因和代谢物，构建了果树抗旱调控网络。这一发现为深入理解果树抗旱机制提供了新的视角。

该论文的发表标志着实验室在果树抗逆研究方面达到了国际先进水平。`,
        excerpt: '李教授团队在《Plant Physiology》发表重要研究成果，揭示了果树抗旱的新机制...',
        published: true,
        publishedAt: new Date('2024-01-08'),
        authorId: admin.id,
        categoryId: categories[1].id
      }
    }),
    db.post.create({
      data: {
        title: '实验室举办学术研讨会',
        slug: 'academic-seminar-2023',
        content: `成功举办"旱区果树研究前沿"学术研讨会，邀请了国内外知名专家学者参会。

会议邀请了来自中国科学院、中国农业科学院等单位的10余位专家学者，就旱区果树研究的最新进展进行了深入交流。会议期间还参观了实验室的试验基地。

此次研讨会促进了学术交流，为今后的合作研究奠定了良好基础。`,
        excerpt: '成功举办"旱区果树研究前沿"学术研讨会，邀请了国内外知名专家学者参会...',
        published: true,
        publishedAt: new Date('2023-12-20'),
        authorId: editor.id,
        categoryId: categories[2].id
      }
    })
  ])

  console.log('Database seeded successfully!')
  console.log('Admin account:')
  console.log('Email: admin@lab.com')
  console.log('Password: admin123')
  console.log('')
  console.log('Editor account:')
  console.log('Email: editor@lab.com')
  console.log('Password: editor123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })