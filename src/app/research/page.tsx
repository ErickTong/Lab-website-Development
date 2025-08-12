'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, BookOpen, ExternalLink, Search, Filter } from "lucide-react"
import Link from "next/link"

interface Publication {
  id: string
  title: string
  abstract?: string
  authors: string
  journal: string
  year: number
  volume?: string
  issue?: string
  pages?: string
  doi?: string
  url?: string
  pdfUrl?: string
  author: {
    name: string
  }
  createdAt: string
}

interface ResearchProject {
  id: string
  title: string
  description?: string
  startDate: string
  endDate?: string
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'SUSPENDED'
  funding?: string
  budget?: number
  author: {
    name: string
  }
  createdAt: string
}

export default function ResearchPage() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [projects, setProjects] = useState<ResearchProject[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'publications' | 'projects'>('publications')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [pubsRes, projsRes] = await Promise.all([
        fetch('/api/publications'),
        fetch('/api/projects')
      ])
      
      if (pubsRes.ok) {
        const pubsData = await pubsRes.json()
        setPublications(pubsData)
      }
      
      if (projsRes.ok) {
        const projsData = await projsRes.json()
        setProjects(projsData)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'COMPLETED': return 'bg-blue-100 text-blue-800'
      case 'PLANNING': return 'bg-yellow-100 text-yellow-800'
      case 'SUSPENDED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return '进行中'
      case 'COMPLETED': return '已完成'
      case 'PLANNING': return '计划中'
      case 'SUSPENDED': return '暂停'
      default: return '未知'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  西北旱区果树发育生物学实验室
                </h1>
                <p className="text-sm text-gray-600">研究成果</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  返回首页
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  登录
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            研究成果
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            展示我们在旱区果树发育生物学领域的最新研究成果和项目进展
          </p>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('publications')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'publications'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              学术论文
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-4 px-2 border-b-2 font-medium text-sm ${
                activeTab === 'projects'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              研究项目
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">加载中...</p>
            </div>
          ) : (
            <>
              {activeTab === 'publications' && (
                <div className="max-w-6xl mx-auto">
                  <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">学术论文</h2>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="搜索论文..."
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <Button variant="outline" size="sm">
                        <Filter className="mr-2 h-4 w-4" />
                        筛选
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {publications.length > 0 ? publications.map((pub) => (
                      <Card key={pub.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg mb-2">{pub.title}</CardTitle>
                              <CardDescription className="text-sm">
                                <span className="font-medium">{pub.authors}</span> • {pub.journal} ({pub.year})
                              </CardDescription>
                            </div>
                            <div className="flex items-center gap-2">
                              {pub.url && (
                                <Button variant="ghost" size="sm" asChild>
                                  <a href={pub.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </Button>
                              )}
                              {pub.pdfUrl && (
                                <Button variant="outline" size="sm" asChild>
                                  <a href={pub.pdfUrl} target="_blank" rel="noopener noreferrer">
                                    PDF
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {pub.abstract && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {pub.abstract}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <CalendarDays className="h-4 w-4" />
                              <span>{new Date(pub.createdAt).toLocaleDateString('zh-CN')}</span>
                            </div>
                            {pub.doi && (
                              <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                                DOI: {pub.doi}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    )) : (
                      <div className="text-center py-12">
                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">暂无学术论文</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'projects' && (
                <div className="max-w-6xl mx-auto">
                  <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">研究项目</h2>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                          type="text"
                          placeholder="搜索项目..."
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.length > 0 ? projects.map((project) => (
                      <Card key={project.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg">{project.title}</CardTitle>
                            <Badge className={getStatusColor(project.status)}>
                              {getStatusText(project.status)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {project.description && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {project.description}
                            </p>
                          )}
                          <div className="space-y-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <CalendarDays className="h-4 w-4" />
                              <span>
                                {new Date(project.startDate).toLocaleDateString('zh-CN')}
                                {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString('zh-CN')}`}
                              </span>
                            </div>
                            {project.funding && (
                              <div>
                                <span className="font-medium">资助机构:</span> {project.funding}
                              </div>
                            )}
                            {project.budget && (
                              <div>
                                <span className="font-medium">预算:</span> ¥{project.budget.toLocaleString()}
                              </div>
                            )}
                            <div className="text-xs text-gray-400">
                              负责人: {project.author.name}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )) : (
                      <div className="col-span-full text-center py-12">
                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">暂无研究项目</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}