import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Users, BookOpen, FlaskConical, TreePine, MapPin, LogIn } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FlaskConical className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  西北旱区果树发育生物学实验室
                </h1>
                <p className="text-sm text-gray-600">Northwest Arid Area Fruit Tree Developmental Biology Laboratory</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/research">
                <Button variant="ghost" size="sm">
                  研究成果
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  <LogIn className="mr-2 h-4 w-4" />
                  登录
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              西北旱区果树发育生物学实验室
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Northwest Arid Area Fruit Tree Developmental Biology Laboratory
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <div className="flex items-center gap-2 text-green-100">
                <MapPin className="h-5 w-5" />
                <span>中国·西北地区</span>
              </div>
              <div className="flex items-center gap-2 text-green-100">
                <FlaskConical className="h-5 w-5" />
                <span>专注于旱区果树研究</span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-green-50 to-transparent"></div>
      </section>

      {/* Lab Overview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                实验室简介
              </h2>
              <div className="w-24 h-1 bg-green-600 mx-auto"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TreePine className="h-6 w-6 text-green-600" />
                    研究方向
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary">果树发育</Badge>
                      <p className="text-sm text-gray-600">旱区果树生长发育机制研究</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary">抗逆机制</Badge>
                      <p className="text-sm text-gray-600">果树抗旱、抗寒分子机制</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary">遗传育种</Badge>
                      <p className="text-sm text-gray-600">旱区果树品种改良与育种</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="secondary">生态适应</Badge>
                      <p className="text-sm text-gray-600">果树对旱区环境的适应性研究</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-green-600" />
                    研究特色
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    本实验室致力于西北旱区果树发育生物学研究，重点探索果树在干旱环境下的生长发育规律、
                    抗逆机制及适应性进化。通过多学科交叉研究，为旱区果树产业提供理论支撑和技术支持。
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-sm text-gray-600">多学科交叉研究平台</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-sm text-gray-600">先进的实验设备和技术</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-sm text-gray-600">产学研紧密结合</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              研究团队
            </h2>
            <div className="w-24 h-1 bg-green-600 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {/* Team Member 1 */}
            <Card className="text-center">
              <CardHeader className="pb-4">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-lg">李教授</AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">李教授</CardTitle>
                <CardDescription>实验室主任 / 博士生导师</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  从事果树发育生物学研究20余年，在旱区果树抗逆机制研究方面取得重要成果。
                </p>
                <Badge variant="outline">果树发育</Badge>
              </CardContent>
            </Card>

            {/* Team Member 2 */}
            <Card className="text-center">
              <CardHeader className="pb-4">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-lg">王教授</AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">王教授</CardTitle>
                <CardDescription>副主任 / 硕士生导师</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  专注于果树分子生物学和遗传育种研究，主持多项国家级科研项目。
                </p>
                <Badge variant="outline">分子育种</Badge>
              </CardContent>
            </Card>

            {/* Team Member 3 */}
            <Card className="text-center">
              <CardHeader className="pb-4">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-lg">张博士</AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">张博士</CardTitle>
                <CardDescription>副研究员</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  研究方向为果树生理生态学，在果树抗旱生理机制研究方面经验丰富。
                </p>
                <Badge variant="outline">生理生态</Badge>
              </CardContent>
            </Card>

            {/* Team Member 4 */}
            <Card className="text-center">
              <CardHeader className="pb-4">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-lg">刘博士</AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg">刘博士</CardTitle>
                <CardDescription>助理研究员</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  从事果树基因组学和生物信息学研究，在果树功能基因研究方面有突出贡献。
                </p>
                <Badge variant="outline">基因组学</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              最新动态
            </h2>
            <div className="w-24 h-1 bg-green-600 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* News 1 */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>2024年1月15日</span>
                </div>
                <CardTitle className="text-lg">
                  实验室获得国家自然科学基金重点项目资助
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  我实验室申报的"旱区果树抗逆分子机制研究"项目获得国家自然科学基金重点项目资助...
                </p>
                <Button variant="outline" size="sm">
                  阅读更多
                </Button>
              </CardContent>
            </Card>

            {/* News 2 */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>2024年1月8日</span>
                </div>
                <CardTitle className="text-lg">
                  研究成果在国际顶级期刊发表
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  李教授团队在《Plant Physiology》发表重要研究成果，揭示了果树抗旱的新机制...
                </p>
                <Button variant="outline" size="sm">
                  阅读更多
                </Button>
              </CardContent>
            </Card>

            {/* News 3 */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <CalendarDays className="h-4 w-4" />
                  <span>2023年12月20日</span>
                </div>
                <CardTitle className="text-lg">
                  实验室举办学术研讨会
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  成功举办"旱区果树研究前沿"学术研讨会，邀请了国内外知名专家学者参会...
                </p>
                <Button variant="outline" size="sm">
                  阅读更多
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            加入我们的研究团队
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            我们欢迎有志于果树发育生物学研究的优秀人才加入，共同探索旱区果树的奥秘。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              <Users className="mr-2 h-5 w-5" />
              了解更多
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
              联系我们
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}