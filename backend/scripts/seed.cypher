// ============================================================
// SEED DATA — Neo4j Graph Explorer
// Ejecutar en Neo4j Browser o con `cypher-shell`
// ============================================================

CREATE

  // ========== USUARIOS ==========
  (audino:Persona {nombre: "Audino", rol: "Desarrollador Auth"}),
  (emerson:Persona {nombre: "Emerson", rol: "Frontend & API Gateway"}),
  (andres:Persona {nombre: "Andres", rol: "Desarrollador Clientes & Storage"}),
  (kevin:Persona {nombre: "Kevin", rol: "Desarrollador Lista Checkeo"}),
  (oscar:Persona {nombre: "Oscar", rol: "Desarrollador Vehiculos"}),

  // ========== MICROSERVICIOS ==========
  (ui:Interfaz {nombre: "UI React", tecnologia: "React"}),
  (api_gateway:Servicio {nombre: "API Gateway", tecnologia: "NestJS"}),
  (auth:Microservicio {nombre: "AUTH", tecnologia: "NestJS"}),
  (clientes:Microservicio {nombre: "CLIENTES", tecnologia: "SpringBoot"}),
  (vehiculos:Microservicio {nombre: "VEHICULOS", tecnologia: "SpringBoot"}),
  (lista:Microservicio {nombre: "LISTA_CHECKEO", tecnologia: "Django"}),
  (storage:Microservicio {nombre: "STORAGE_IMAGES", tecnologia: "NestJS"}),

  // ========== BASES DE DATOS ==========
  (redis:BaseDatos {nombre: "Redis", tipo: "Cache"}),
  (postgres_clientes:BaseDatos {nombre: "PostgreSQL Clientes", tipo: "Relacional"}),
  (postgres_vehiculos:BaseDatos {nombre: "PostgreSQL Vehiculos", tipo: "Relacional"}),
  (mongo:BaseDatos {nombre: "MongoDB", tipo: "NoSQL"}),
  (cassandra:BaseDatos {nombre: "Cassandra", tipo: "Distribuida"}),

  // ========== INFRAESTRUCTURA ==========
  (router:Dispositivo {nombre: "Router", ip: "192.168.1.1"}),
  (servidor:Servidor {nombre: "Ubuntu Server", ip: "192.168.1.35"}),
  (cliente_final:Entidad {nombre: "CDA del Putumayo E.U"}),

  // ========== FLUJO PRINCIPAL ==========
  (ui)-[:SOLICITA {peso: 5, latencia_ms: 20}]->(api_gateway),

  (api_gateway)-[:REDIRECCIONA {peso: 10}]->(auth),
  (api_gateway)-[:REDIRECCIONA {peso: 8}]->(clientes),
  (api_gateway)-[:REDIRECCIONA {peso: 8}]->(vehiculos),
  (api_gateway)-[:REDIRECCIONA {peso: 7}]->(lista),
  (api_gateway)-[:REDIRECCIONA {peso: 6}]->(storage),

  // ========== BASES DE DATOS ==========
  (auth)-[:VALIDA {peso: 3}]->(redis),
  (auth)-[:GUARDA {peso: 5}]->(postgres_clientes),
  (clientes)-[:CRUD {peso: 6}]->(postgres_clientes),
  (vehiculos)-[:CRUD {peso: 7}]->(postgres_vehiculos),
  (storage)-[:ALMACENA {peso: 4}]->(mongo),
  (lista)-[:PERSISTE {peso: 5}]->(cassandra),

  // ========== CICLO ==========
  (api_gateway)-[:ENVIA_DATOS]->(lista),
  (lista)-[:VALIDA_VEHICULO]->(vehiculos),
  (vehiculos)-[:RESPONDE_A]->(api_gateway),

  // ========== BIDIRECCIONAL ==========
  (emerson)-[:COLABORA_CON]->(andres),
  (andres)-[:COLABORA_CON]->(emerson),
  (kevin)-[:COLABORA_CON]->(oscar),
  (oscar)-[:COLABORA_CON]->(kevin),
  (auth)-[:SINCRONIZA]->(clientes),
  (clientes)-[:SINCRONIZA]->(auth),

  // ========== DESARROLLO ==========
  (audino)-[:DESARROLLA]->(auth),
  (oscar)-[:DESARROLLA]->(vehiculos),
  (kevin)-[:DESARROLLA]->(lista),
  (andres)-[:DESARROLLA]->(clientes),
  (andres)-[:DESARROLLA]->(storage),
  (emerson)-[:DESARROLLA]->(ui),
  (emerson)-[:DESARROLLA]->(api_gateway),

  // ========== RED ==========
  (router)-[:CONECTA]->(servidor),

  (servidor)-[:HOSTEA]->(api_gateway),
  (servidor)-[:HOSTEA]->(auth),
  (servidor)-[:HOSTEA]->(clientes),
  (servidor)-[:HOSTEA]->(vehiculos),
  (servidor)-[:HOSTEA]->(lista),
  (servidor)-[:HOSTEA]->(storage),

  // ========== CLIENTE ==========
  (cliente_final)-[:USA]->(ui),

  (ui)-[:MUESTRA_RESULTADOS]->(cliente_final)

RETURN *;
