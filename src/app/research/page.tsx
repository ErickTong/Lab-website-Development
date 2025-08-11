"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  BookOpen, 
  FlaskConical, 
  Award, 
  Calendar, 
  ExternalLink,
  Search,
  Filter,
  FileText,
  Users,
  TrendingUp
} from "lucide-react"
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
  createdAt: string
}

interface ResearchProject {
  id: string
  title: string
  description?: string
  startDate: string
  endDate?: string
  status: string
  funding?: string
  budget?: number
  createdAt: string
}

export default function ResearchPage() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [projects, setProjects] = useState<ResearchProject[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [yearFilter, setYearFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchResearchData()
  }, [])

  const fetchResearchData = async () => {
    try {
      // Fetch publications
      const publicationsResponse = await fetch("/api/publications")
      if (publicationsResponse.ok) {
        const publicationsData = await publicationsResponse.json()
        setPublications(publicationsData)
      }

      // Fetch projects
      const projectsResponse = await fetch("/api/projects")
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json()
        setProjects(projectsData)
      }
    } catch (error) {
      console.error("Error fetching research data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPublications = publications.filter(pub => {
    const matchesSearch = pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pub.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pub.journal.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesYear = yearFilter === "all" || pub.year.toString() === yearFilter
    return matchesSearch && matchesYear
  })

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = statusFilter === "all" || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PLANNING": return "bg-yellow-100 text-yellow-800"
      case "ACTIVE": return "bg-green-100 text-green-800"
      case "COMPLETED": return "bg-blue-100 text-blue-800"
      case "SUSPENDED": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "PLANNING": return "规划中"
      case "ACTIVE": return "进行中"
      case "COMPLETED": return "已完成"
      case "SUSPENDED": return "暂停"
      default: return "未知"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN")
  }

  const getUniqueYears = () => {
    const years = Array.from(new Set(publications.map(pub => pub.year.toString()))).sort((a, b) => parseInt(b) - parseInt(a))
    return years
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              研究成果
            </h1>
            <p className="text-xl text-green-100 max-w-3xl mx-auto">
              展示西北旱区果树发育生物学实验室的研究论文、科研项目和学术成果
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <BookOpen className="h-12 w-12 text-green-600 mb-4" />
              <div className="text-3xl font-bold text-gray-800">{publications.length}</div>
              <div className="text-gray-600">发表论著</div>
            </div>
            <div className="flex flex-col items-center">
              <FlaskConical className="h-12 w-12 text-green-600 mb-4" />
              <div className="text-3xl font-bold text-gray-800">{projects.filter(p => p.status === "ACTIVE").length}</div>
              <div className="text-gray-600">进行中项目</div>
            </div>
            <div className="flex flex-col items-center">
              <Award className="h-12 w-12 text-green-600 mb-4" />
              <div className="text-3xl font-bold text-gray-800">{projects.filter(p => p.status === "COMPLETED").length}</div>
              <div className="text-gray-600">已完成项目</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="搜索研究成果..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4">
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="年份" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有年份</SelectItem>
                  {getUniqueYears().map(year => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="状态" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有状态</SelectItem>
                  <SelectItem value="PLANNING">规划中</SelectItem>
                  <SelectItem value="ACTIVE">进行中</SelectItem>
                  <SelectItem value="COMPLETED">已完成</SelectItem>
                  <SelectItem value="SUSPENDED">暂停</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="publications" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="publications" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                学术论著
              </TabsTrigger>
              <TabsTrigger value="projects" className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4" />
                研究项目
              </TabsTrigger>
            </TabsList>

            {/* Publications Tab */}
            <TabsContent value="publications" className="mt-8">
              <div className="grid gap-6">
                {filteredPublications.length > 0 ? (
                  filteredPublications.map((publication) => (
                    <Card key={publication.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{publication.title}</CardTitle>
                            <CardDescription className="text-base">
                              <div className="flex flex-wrap items-center gap-4 text-sm">
                                <span className="font-medium">{publication.authors}</span>
                                <span>•</span>
                                <span>{publication.journal}</span>
                                <span>•</span>
                                <span>{publication.year}</span>
                                {publication.volume && <span>• Vol. {publication.volume}</span>}
                                {publication.issue && <span>• Issue {publication.issue}</span>}
                                {publication.pages && <span>• pp. {publication.pages}</span>}
                              </div>
                            </CardDescription>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Badge variant="outline">{publication.year}</Badge>
                            {publication.doi && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={`https://doi.org/${publication.doi}`} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-3 w-3 mr-1" />
                                  DOI
                                </a>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      {publication.abstract && (
                        <CardContent>
                          <p className="text-gray-600 mb-4">{publication.abstract}</p>
                          <div className="flex gap-2">
                            {publication.pdfUrl && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={publication.pdfUrl} target="_blank" rel="noopener noreferrer">
                                  <FileText className="h-4 w-4 mr-1" />
                                  PDF
                                </a>
                              </Button>
                            )}
                            {publication.url && (
                              <Button size="sm" variant="outline" asChild>
                                <a href={publication.url} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="h-4 w-4 mr-1" />
                                  查看原文
                                </a>
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                        {searchTerm ? "没有找到匹配的论著" : "暂无论著"}
                      </h3>
                      <p className="text-gray-500">
                        {searchTerm ? "请尝试其他搜索词" : "敬请期待更多研究成果"}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="mt-8">
              <div className="grid gap-6">
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <Card key={project.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
                            <CardDescription>
                              <div className="flex flex-wrap items-center gap-4 text-sm">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {formatDate(project.startDate)}
                                  {project.endDate && ` - ${formatDate(project.endDate)}`}
                                </span>
                                {project.funding && (
                                  <span className="flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    {project.funding}
                                  </span>
                                )}
                              </div>
                            </CardDescription>
                          </div>
                          <Badge className={getStatusColor(project.status)}>
                            {getStatusText(project.status)}
                          </Badge>
                        </div>
                      </CardHeader>
                      {project.description && (
                        <CardContent>
                          <p className="text-gray-600 mb-4">{project.description}</p>
                          {project.budget && (
                            <div className="text-sm text-gray-500">
                              项目预算: ¥{project.budget.toLocaleString()}
                            </div>
                          )}
                        </CardContent>
                      )}
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="text-center py-12">
                      <FlaskConical className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-600 mb-2">
                        {searchTerm ? "没有找到匹配的项目" : "暂无项目"}
                      </h3>
                      <p className="text-gray-500">
                        {searchTerm ? "请尝试其他搜索词" : "敬请期待更多研究项目"}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}