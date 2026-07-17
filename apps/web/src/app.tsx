import { ThemeProvider } from './components/theme-provider'
import { ThemeToggle } from './components/theme-toggle'

export function App() {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="l3d-theme">
			<div className="min-h-screen flex items-center justify-center">
				<ThemeToggle />
			</div>
		</ThemeProvider>
	)
}
