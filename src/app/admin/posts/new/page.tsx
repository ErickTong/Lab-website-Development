"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Upload, 
  LogOut,
  Settings,
  Save,
  Eye,
  Image as ImageIcon,
  X
} from "lucide-react"
import Link from "next/link"
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ExtensionImage from '@tiptap/extension-image'
import ExtensionLink from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

interface User {
  id: string
  username: string
  email: string
  name?: string
  role: string
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function NewPost() {
  const [user, setUser] = useState<User | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    published: false,
    categoryId: "",
    coverImage: ""
  })

  const editor = useEditor({
    extensions: [
      StarterKit,
      ExtensionImage.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      ExtensionLink.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: '开始编写您的内容...',
      }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setFormData(prev => ({
        ...prev,
        content: editor.getHTML()
      }))
    },
  })

  useEffect(() => {
    checkAuth()
    fetchCategories()
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

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("authToken")
      
      const response = await fetch("/api/categories", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const categoriesData = await response.json()
        setCategories(categoriesData)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        
        if (editor) {
          editor.chain().focus().setImage({ src: data.url }).run()
        }
      } else {
        alert("图片上传失败")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("图片上传失败")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")

    try {
      const token = localStorage.getItem("authToken")
      
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("文章创建成功！")
        setTimeout(() => {
          router.push("/admin/posts")
        }, 2000)
      } else {
        setError(data.message || "创建失败")
      }
    } catch (err) {
      setError("网络错误，请稍后重试")
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("user")
    router.push("/auth/login")
  }

  const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) return null

    return (
      <div className="editor-toolbar">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          <strong>B</strong>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          <em>I</em>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          H1
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          H2
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
        >
          H3
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          • 列表
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
        >
          1. 列表
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
        >
          " 引用
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          撤销
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          重做
        </Button>
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button type="button" variant="ghost" size="sm">
            <ImageIcon className="h-4 w-4 mr-1" />
            插入图片
          </Button>
        </div>
      </div>
    )
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
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  新建文章
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
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-green-200 bg-green-50 text-green-800">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>基本信息</CardTitle>
                  <CardDescription>填写文章的基本信息</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">标题 *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="请输入文章标题"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">摘要</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                      placeholder="请输入文章摘要（可选）"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">分类</Label>
                      <Select value={formData.categoryId} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择分类" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="published">发布状态</Label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="published"
                          checked={formData.published}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                        />
                        <Label htmlFor="published">
                          {formData.published ? "已发布" : "草稿"}
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Content Editor */}
              <Card>
                <CardHeader>
                  <CardTitle>内容编辑</CardTitle>
                  <CardDescription>使用富文本编辑器编写文章内容</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden shadow-sm">
                    <MenuBar editor={editor} />
                    <EditorContent
                      editor={editor}
                      className="ProseMirror"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button type="submit" disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? "保存中..." : "保存文章"}
                  </Button>
                  {formData.published && (
                    <Button type="button" variant="outline">
                      <Eye className="mr-2 h-4 w-4" />
                      预览
                    </Button>
                  )}
                </div>
                <Link href="/admin/posts">
                  <Button type="button" variant="outline">
                    取消
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}