import Keycloak from 'keycloak-js'

const keycloak = new Keycloak({
  url: 'http://localhost:8180',
  realm: 'lab4',
  clientId: 'vue-lab4',
})

export default keycloak
