'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, GraduationCap, FlaskConical, Users, CalendarDays } from "lucide-react"
import Link from "next/link"

interface TeamMember {
  id: string
  name: string
  title: string
  avatar?: string
  bio?: string
  email?: string
  phone?: string
  research?: string
  education?: string
  order: number
  active: boolean
  createdAt: string
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      const response = await fetch('/api/team-members')
      if (response.ok) {
        const data = await response.json()
        setTeamMembers(data.teamMembers || [])
      }
    } catch (error) {
      console.error('Error fetching team members:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <FlaskConical className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  西北旱区果树发育生物学实验室
                </h1>
                <p className="text-sm text-gray-600">研究团队</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  返回首页
                </Button>
              </Link>
              <Link href="/research">
                <Button variant="ghost" size="sm">
                  研究成果
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
            研究团队
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto">
            汇聚了果树发育生物学领域的优秀研究人才，致力于旱区果树研究
          </p>
        </div>
      </section>

      {/* Team Stats */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {teamMembers.filter(m => m.active).length}
              </div>
              <div className="text-gray-600">活跃成员</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">20+</div>
              <div className="text-gray-600">年研究经验</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600">发表成果</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              团队成员
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              我们的团队由经验丰富的研究人员组成，在果树发育生物学领域拥有深厚的研究积累
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {teamMembers
              .filter(member => member.active)
              .sort((a, b) => a.order - b.order)
              .map((member) => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center pb-4">
                    <Avatar className="w-24 h-24 mx-auto mb-4">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="text-xl">
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-xl">{member.name}</CardTitle>
                    <CardDescription className="text-base font-medium text-green-600">
                      {member.title}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {member.bio && (
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {member.bio}
                      </p>
                    )}
                    
                    {member.research && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <FlaskConical className="h-4 w-4" />
                          研究方向
                        </h4>
                        <p className="text-sm text-gray-600">{member.research}</p>
                      </div>
                    )}

                    {member.education && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          教育背景
                        </h4>
                        <p className="text-sm text-gray-600">{member.education}</p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-2">
                      {member.email && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={`mailto:${member.email}`}>
                            <Mail className="mr-1 h-3 w-3" />
                            邮箱
                          </a>
                        </Button>
                      )}
                      {member.phone && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={`tel:${member.phone}`}>
                            <Phone className="mr-1 h-3 w-3" />
                            电话
                          </a>
                        </Button>
                      )}
                    </div>

                    <div className="text-xs text-gray-400 pt-2 border-t">
                      加入时间: {new Date(member.createdAt).toLocaleDateString('zh-CN')}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {teamMembers.filter(m => m.active).length === 0 && (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">暂无团队成员信息</p>
            </div>
          )}
        </div>
      </section>

      {/* Join Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              加入我们的团队
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              我们欢迎有志于果树发育生物学研究的优秀人才加入，共同探索旱区果树的奥秘。
            </p>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">博士后研究员</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    招聘果树发育生物学、分子生物学等相关专业的博士后研究人员
                  </p>
                  <Button variant="outline" size="sm">
                    了解详情
                  </Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">研究生</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">
                    欢迎对果树研究有浓厚兴趣的硕士、博士研究生加入我们
                  </p>
                  <Button variant="outline" size="sm">
                    了解详情
                  </Button>
                </CardContent>
              </Card>
            </div>
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              联系我们
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}