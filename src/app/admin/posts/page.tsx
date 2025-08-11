"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Upload, 
  LogOut,
  Settings,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Eye,
  Search
} from "lucide-react"
import Link from "next/link"

interface User {
  id: string
  username: string
  email: string
  name?: string
  role: string
}

interface Post {
  id: string
  title: string
  slug: string
  published: boolean
  createdAt: string
  author: {
    name: string
  }
  category?: {
    name: string
  }
}

export default function PostsManagement() {
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    fetchPosts()
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem("authToken")
    const userData = localStorage.getItem("user")
    
    if (!token || !userData) {
      router.push("/auth/login")
      return
    }
    
    setUser(JSON.parse(userData))
  }

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("authToken")
      
      const response = await fetch("/api/posts", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const postsData = await response.json()
        setPosts(postsData)
      }
    } catch (error) {
      console.error("Error fetching posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    router.push("/auth/login")
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm("确定要删除这篇文章吗？")) {
      return
    }

    try {
      const token = localStorage.getItem("authToken")
      
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        setPosts(posts.filter(post => post.id !== postId))
      } else {
        alert("删除失败")
      }
    } catch (error) {
      console.error("Error deleting post:", error)
      alert("删除失败")
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN")
  }

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  内容管理
                </h1>
                <p className="text-sm text-gray-600">西北旱区果树发育生物学实验室</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-3">
                  <div className="text-sm">
                    <p className="font-medium">{user.name || user.username}</p>
                    <p className="text-gray-500">{user.role}</p>
                  </div>
                </div>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                退出
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">管理菜单</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/admin">
                  <Button variant="ghost" className="w-full justify-start">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    仪表板
                  </Button>
                </Link>
                <Link href="/admin/posts">
                  <Button variant="secondary" className="w-full justify-start">
                    <FileText className="mr-2 h-4 w-4" />
                    内容管理
                  </Button>
                </Link>
                <Link href="/admin/users">
                  <Button variant="ghost" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    用户管理
                  </Button>
                </Link>
                <Link href="/admin/files">
                  <Button variant="ghost" className="w-full justify-start">
                    <Upload className="mr-2 h-4 w-4" />
                    文件管理
                  </Button>
                </Link>
                <Link href="/admin/settings">
                  <Button variant="ghost" className="w-full justify-start">
                    <Settings className="mr-2 h-4 w-4" />
                    系统设置
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">文章管理</h2>
                <p className="text-gray-600">管理所有文章内容</p>
              </div>
              <Link href="/admin/posts/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  新建文章
                </Button>
              </Link>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="搜索文章标题..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Posts List */}
            <Card>
              <CardHeader>
                <CardTitle>文章列表</CardTitle>
                <CardDescription>共 {filteredPosts.length} 篇文章</CardDescription>
              </CardHeader>
              <CardContent>
                {filteredPosts.length > 0 ? (
                  <div className="space-y-4">
                    {filteredPosts.map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex-1">
                          <h3 className="font-medium text-lg">{post.title}</h3>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(post.createdAt)}
                            </span>
                            <span>作者: {post.author.name}</span>
                            {post.category && (
                              <Badge variant="outline">{post.category.name}</Badge>
                            )}
                            <Badge variant={post.published ? "default" : "secondary"}>
                              {post.published ? "已发布" : "草稿"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/blog/${post.slug}`} target="_blank">
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/admin/posts/edit/${post.id}`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>{searchTerm ? "没有找到匹配的文章" : "暂无文章"}</p>
                    <Link href="/admin/posts/new">
                      <Button className="mt-4">
                        <Plus className="mr-2 h-4 w-4" />
                        创建第一篇文章
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}