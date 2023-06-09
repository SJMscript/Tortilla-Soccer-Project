# Tortilla-Soccer

## [See the App!](https://tortilla-soccer.netlify.app/)

![App Logo](![Alt text](public/images/tortilla_futbol.png))

## Description

**NOTE -** Describe your project in one/two lines.
#### [Client Repo here](https://github.com/SJMscript/Tortilla-Soccer-Project-client)
#### [Server Repo here](https://github.com/SJMscript/Tortilla-Soccer-Server)

## Backlog Functionalities

**NOTE -** We will love to add despcription about every stadium, and a hall of fame to implement players, trainers and dates that make the history of Spanish National Team.


## Technologies used

**NOTE -** 
We used:
- HTML
- CSS
- JavaScript
- NodeJS
- MongoDB
- Postman 
- React
- Bootstrap

# Server Structure

## Models

User model

```javascript
{
      username: {
          type: String,
          required: true,
          unique: true,
          trim: true
      },
      email: {
          type: String,
          required: true,
          unique: true,
          lowercase: true,
          trim: true
      },
      password: {
          type: String,
          required: true
      },
      profileImg: {
        type: String,
        trim: true
    },
      role: {
          type: String,
          enum: ["user", "moderator"],
          default: "user"
      },
       likedPlayers: [{
          type: Schema.Types.ObjectId,
          ref: "Player"
      }],
      top11: [{
          type: Schema.Types.ObjectId,
          ref: "Player"
      }], 
  }
```

Player model

```javascript
 {
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    currentTeam: {
        type: String,
        required: true,
    },
    marketValue: {
        type: Number,
        required: true
   },
    age: {
        type: Number,
        required: true
    },
    skillfulLeg: {
        type: String,
        required: true,
        enum: ["Right", "Left"]
    },
    playerPosition: {
        type: String,
        required: true,
        trim: true,
        enum: ["goalkeeper", "defense", "midfielder", "forward"]
    },
    imageUrl : String,
    creator:{
        type: Schema.Types.ObjectId,
        ref: "User"     
    }
    
}
```

Comment model
```javascript
{
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    player: {
        type: Schema.Types.ObjectId,
        ref: "Player"
    }
}
```

Top11 model
```javascript
{
     creator: {
         type: Schema.Types.ObjectId,
         ref: "User"
     },
    position: {
        type: String,
        required: true,
        trim: true,
        enum: ["goalkeeper", "defense", "midfielder", "forward"]
    },
    player: {
        type: Schema.Types.ObjectId,
        ref: "Player"
    }

}
```


## Links

### Collaborators

[Santiago Massa](https://github.com/SJMscript)

[Juan Diego Arocha](https://github.com/JuanDiegoArocha)

### Project

[Repository Link Client](https://github.com/SJMscript/Tortilla-Soccer-Project-client)

[Repository Link Server](https://github.com/SJMscript/Tortilla-Soccer-Server)

[Deploy Link](https://tortilla-soccer.netlify.app/)


### Slides

[Slides Link](https://docs.google.com/presentation/d/1JyQ5s2Aq2CpEKuORWS3brOVPycDllR7sjWEUGWsM8Bo/edit?usp=sharing)