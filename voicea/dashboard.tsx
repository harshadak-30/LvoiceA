import { Bell, ChevronDown, Home, LayoutGrid, MessageSquare, PieChart, Search, Settings, Users } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-indigo-600">Dashboard</h1>
        </div>
        <nav className="mt-6">
          <NavItem icon={<Home size={20} />} text="Home" active />
          <NavItem icon={<PieChart size={20} />} text="Analytics" />
          <NavItem icon={<Users size={20} />} text="Team" />
          <NavItem icon={<MessageSquare size={20} />} text="Messages" />
          <NavItem icon={<LayoutGrid size={20} />} text="Projects" />
          <NavItem icon={<Settings size={20} />} text="Settings" />
        </nav>
        <div className="absolute bottom-0 w-64 p-4 border-t">
          <div className="flex items-center">
            <img src="/placeholder.svg?height=40&width=40" alt="Profile" className="w-10 h-10 rounded-full" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-800">John Doe</p>
              <p className="text-xs text-gray-500">john@example.com</p>
            </div>
            <ChevronDown size={20} className="ml-auto text-gray-400" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-800">Welcome back, John!</h2>
            <div className="flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
              </div>
              <button className="ml-4 p-2 text-gray-400 hover:text-gray-600">
                <Bell size={20} />
              </button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Quick Actions */}
          <section className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <QuickActionButton icon={<Users size={24} />} text="Add Team Member" />
              <QuickActionButton icon={<MessageSquare size={24} />} text="Send Message" />
              <QuickActionButton icon={<LayoutGrid size={24} />} text="Create Project" />
              <QuickActionButton icon={<PieChart size={24} />} text="View Reports" />
            </div>
          </section>

          {/* Recent Activity and Projects */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
              <div className="bg-white rounded-lg shadow">
                <ActivityItem
                  avatar="/placeholder.svg?height=40&width=40"
                  name="Alice Johnson"
                  action="commented on"
                  target="Project X"
                  time="2 hours ago"
                />
                <ActivityItem
                  avatar="/placeholder.svg?height=40&width=40"
                  name="Bob Smith"
                  action="completed task"
                  target="Design Homepage"
                  time="4 hours ago"
                />
                <ActivityItem
                  avatar="/placeholder.svg?height=40&width=40"
                  name="Carol Williams"
                  action="started"
                  target="New Project Y"
                  time="Yesterday"
                />
              </div>
            </section>

            {/* Projects */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Projects</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ProjectCard
                  title="Website Redesign"
                  description="Revamp the company website with a modern look"
                  progress={75}
                />
                <ProjectCard
                  title="Mobile App"
                  description="Develop a new mobile app for iOS and Android"
                  progress={40}
                />
                <ProjectCard
                  title="Marketing Campaign"
                  description="Plan and execute Q3 marketing campaign"
                  progress={60}
                />
                <ProjectCard title="Data Analysis" description="Analyze customer data for insights" progress={90} />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}

// Define a type for the props
type NavItemProps = {
  icon: React.ReactNode;
  text: string;
  active?: boolean;
};

function NavItem({ icon, text, active = false }: NavItemProps) {
  return (
    <a
      href="#"
      className={`flex items-center px-6 py-3 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 ${
        active ? "bg-indigo-50 text-indigo-600" : ""
      }`}
    >
      {icon}
      <span className="ml-3">{text}</span>
    </a>
  );
}

// Define a type for the props
type QuickActionButtonProps = {
  icon: React.ReactNode;
  text: string;
};

function QuickActionButton({ icon, text }: QuickActionButtonProps) {
  return (
    <button className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="text-indigo-600 mb-2">{icon}</div>
      <span className="text-sm text-gray-600">{text}</span>
    </button>
  );
}

// Define a type for the props
type ActivityItemProps = {
  avatar: string;
  name: string;
  action: string;
  target: string;
  time: string;
};

function ActivityItem({ avatar, name, action, target, time }: ActivityItemProps) {
  return (
    <div className="flex items-center px-4 py-3 border-b last:border-b-0">
      <img src={avatar || "/placeholder.svg"} alt={name} className="w-10 h-10 rounded-full" />
      <div className="ml-3">
        <p className="text-sm">
          <span className="font-medium text-gray-800">{name}</span> {action}{" "}
          <span className="font-medium text-gray-800">{target}</span>
        </p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
}

// Define a type for the props
type ProjectCardProps = {
  title: string;
  description: string;
  progress: number;
};

function ProjectCard({ title, description, progress }: ProjectCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="text-xs text-gray-500 mt-2">{progress}% Complete</p>
    </div>
  );
}

