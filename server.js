// app server 
const express = require("express")
const app = express()
app.listen(9091, () => console.log("app running..."))

// graphql init
const userData = require("./dbuser.json")
const graphql = require("graphql")
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList } = graphql
const { graphqlHTTP } = require("express-graphql")

// entity
const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: {type: GraphQLInt},
        firstName: {type: GraphQLString},
        lastName: {type: GraphQLString},
        email: {type: GraphQLString},
        password: {type: GraphQLString},
    })
})

// get data
const RootQuery = new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        users: {
            type: new GraphQLList(UserType),
            args: {id: {type: GraphQLInt}},
            resolve(parent, args) {
                // connect to db
                return userData
            }
        },
        user: {
            type: new GraphQLList(UserType),
            args: {id: {type: GraphQLInt}},
            resolve(parent, args) {
                // connect to db
                const user = userData.find(data => data.id === args["id"])
                return [user]
            }
        }
    }
})

// insert data
const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createUser: {
            type: UserType,
            args: {
                firstName: {type: GraphQLString},
                lastName: {type: GraphQLString},
                email: {type: GraphQLString},
                password: {type: GraphQLString},
            },
            resolve(parent, args) {
                // connect to db
                userData.push({
                    id: userData.length + 1,
                    firstName: args.firstName,
                    lastName: args.lastName,
                    email: args.email,
                    password: args.password,
                })
                return args
            }
        }
    }
})

// repository
const schema = new GraphQLSchema({
    query: RootQuery, 
    mutation: Mutation
})

// middleware
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    return next()
})

// router
app.post("/data", graphqlHTTP({
    schema : schema,
}))