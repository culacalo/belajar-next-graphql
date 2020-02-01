import { gql } from 'apollo-boost'

export const POKEMONS = gql`
  query( $first: Int!) {
    val: pokemons(first: $first) {
      id
      number
      name
      image
    }
  }
`