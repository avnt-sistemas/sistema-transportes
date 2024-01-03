const getHomeRoute = (role?: string | null) => {
  switch (role) {
    case 'driver':
      return '/driver/home'
    default:
      return '/home'
  }
}

export default getHomeRoute
