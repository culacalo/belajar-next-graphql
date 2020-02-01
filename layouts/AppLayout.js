const AppLayout = ({ children }) => {
  return (
    <>
      <h1>Header</h1>
        <div>{children}</div>
      <h1>Footer</h1>
    </>
  )
}

export default AppLayout
