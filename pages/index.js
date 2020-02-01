import { useQuery } from '@apollo/react-hooks'
import { POKEMONS } from '../graphql/pokemon'

const Index = () => {
  const { data, loading } = useQuery(POKEMONS, { variables: { first: 10}})

  if (loading) return 'Loading...'

  return (
    <>
      <div>
        {data.val.map((item, i) => {
          return (
            <div key={i}>
            {item.name}
            <img src={item.image} width="50px" height="50px" />
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Index
