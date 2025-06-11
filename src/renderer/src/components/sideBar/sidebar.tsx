import { JSX, ReactNode, useState } from 'react'
import { TbHome2, TbLock, TbLogout } from 'react-icons/tb'
import { Stack, Tooltip, UnstyledButton } from '@mantine/core'
import classes from './sidebar.module.css'
import { useNavigate } from 'react-router-dom'

interface NavbarLinkProps {
  icon: typeof TbHome2
  label: string
  active?: boolean
  to?: string
  onClick?: () => void
}

function NavbarLink({ icon: Icon, label, active, to, onClick }: NavbarLinkProps): JSX.Element {
  const navigate = useNavigate()
  const handleClick = (): void => {
    if (onClick) {
      onClick()
    }
    if (to) {
      navigate(to)
    }
  }
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={handleClick}
        className={`${classes.link}`}
        data-active={active || undefined}
      >
        <Icon size={20} strokeWidth={1.5} />
      </UnstyledButton>
    </Tooltip>
  )
}

const mockdata = [
  { icon: TbHome2, label: 'Home', to: '/' },
  { icon: TbLock, label: 'Comming Soon', to: '/visitor/add' },
  { icon: TbLock, label: 'Comming Soon', to: '/visitor' },
  { icon: TbLock, label: 'Comming Soon', to: '/employee' }
]

interface SidebarProps {
  children?: ReactNode
}

// eslint-disable-next-line react/prop-types
export const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [active, setActive] = useState(0)

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      to={link.to}
      onClick={() => setActive(index)}
    />
  ))

  const logoutSession = (): void => {}

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <div className="col-auto">
        <nav className={classes.navbar}>
          <div className={classes.navbarMain}>
            <Stack justify="center" gap={0}>
              {links}
            </Stack>
          </div>

          <Stack justify="center" gap={0}>
            <NavbarLink icon={TbLogout} onClick={() => logoutSession()} label="Logout" />
          </Stack>
        </nav>
      </div>
      <div className={`${classes.content} col`}>
        <div className="container-fluid px-4">{children}</div>
      </div>
    </div>
  )
}
