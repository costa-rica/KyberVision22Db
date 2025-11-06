# Database Schema Overview

This document provides a comprehensive overview of the KyberVision22Db database schema. All tables use SQLite as the underlying database engine and are managed through Sequelize ORM.

## Core Entity Tables

### users

**Purpose**: User accounts and authentication

| Column                     | Type    | Constraints        | Description                        |
| -------------------------- | ------- | ------------------ | ---------------------------------- |
| id                         | INTEGER | PK, Auto Increment | Primary key                        |
| username                   | STRING  | NOT NULL, UNIQUE   | User's unique username             |
| password                   | STRING  | NOT NULL           | User's password (should be hashed) |
| email                      | STRING  | NOT NULL, UNIQUE   | User's email address               |
| isAdminForKvManagerWebsite | BOOLEAN | DEFAULT false      | Admin privileges flag              |

### teams

**Purpose**: Sports teams within the system

| Column      | Type    | Constraints                 | Description             |
| ----------- | ------- | --------------------------- | ----------------------- |
| id          | INTEGER | PK, Auto Increment          | Primary key             |
| teamName    | STRING  | NOT NULL                    | Team name               |
| city        | STRING  | NULL                        | Team's city             |
| coachName   | STRING  | NULL                        | Coach's name            |
| description | STRING  | NULL                        | Team description        |
| image       | STRING  | NULL                        | Team image path         |
| visibility  | STRING  | NOT NULL, DEFAULT "Private" | Team visibility setting |

### players

**Purpose**: Individual player profiles

| Column    | Type    | Constraints                              | Description         |
| --------- | ------- | ---------------------------------------- | ------------------- |
| id        | INTEGER | PK, Auto Increment                       | Primary key         |
| firstName | STRING  | NOT NULL                                 | Player's first name |
| lastName  | STRING  | NOT NULL                                 | Player's last name  |
| birthDate | DATE    | NULL                                     | Player's birth date |
| image     | STRING  | DEFAULT "\_playerDefaultRedditAlien.png" | Player image path   |

### leagues

**Purpose**: Sports leagues and competitions

| Column   | Type    | Constraints        | Description              |
| -------- | ------- | ------------------ | ------------------------ |
| id       | INTEGER | PK, Auto Increment | Primary key              |
| name     | STRING  | NOT NULL           | League name              |
| category | STRING  | NOT NULL           | League category/division |

### sessions

**Purpose**: Training or match sessions

| Column               | Type    | Constraints        | Description                       |
| -------------------- | ------- | ------------------ | --------------------------------- |
| id                   | INTEGER | PK, Auto Increment | Primary key                       |
| contractLeagueTeamId | INTEGER | NOT NULL           | Reference to league-team contract |
| teamId               | INTEGER | NOT NULL           | Reference to team                 |
| sessionDate          | DATE    | NOT NULL           | Date of session                   |
| city                 | STRING  | NULL               | Session location                  |
| sessionName          | STRING  | NULL               | Session name/description          |

### videos

**Purpose**: Video files associated with sessions

| Column                           | Type    | Constraints        | Description                     |
| -------------------------------- | ------- | ------------------ | ------------------------------- |
| id                               | INTEGER | PK, Auto Increment | Primary key                     |
| sessionId                        | INTEGER | NOT NULL           | Reference to session            |
| contractTeamUserId               | INTEGER | NULL               | Reference to team-user contract |
| filename                         | STRING  | NULL               | Video filename                  |
| url                              | STRING  | NULL               | Video URL                       |
| videoFileCreatedDateTimeEstimate | DATE    | NULL               | Estimated creation time         |
| videoFileSizeInMb                | FLOAT   | NULL               | File size in megabytes          |
| pathToVideoFile                  | STRING  | NULL               | Local file path                 |
| processingCompleted              | BOOLEAN | DEFAULT false      | Processing status flag          |
| processingFailed                 | BOOLEAN | DEFAULT false      | Processing failure flag         |
| youTubeVideoId                   | STRING  | NULL               | YouTube video ID                |
| originalVideoFilename            | STRING  | NULL               | Original filename               |

### scripts

**Purpose**: Scripting sessions for live analysis

| Column                        | Type    | Constraints        | Description          |
| ----------------------------- | ------- | ------------------ | -------------------- |
| id                            | INTEGER | PK, Auto Increment | Primary key          |
| sessionId                     | INTEGER | NOT NULL           | Reference to session |
| timestampReferenceFirstAction | DATE    | NULL               | Reference timestamp  |
| isScriptingLive               | BOOLEAN | DEFAULT false      | Live scripting flag  |

### actions

**Purpose**: Individual game actions/events

| Column            | Type    | Constraints            | Description           |
| ----------------- | ------- | ---------------------- | --------------------- |
| id                | INTEGER | PK, Auto Increment     | Primary key           |
| complexId         | INTEGER | NULL                   | Reference to complex  |
| pointId           | INTEGER | NULL                   | Point identifier      |
| scriptId          | INTEGER | NULL                   | Reference to script   |
| playerId          | INTEGER | NOT NULL               | Reference to player   |
| type              | INTEGER | NOT NULL               | Action type code      |
| subtype           | INTEGER | NULL                   | Action subtype code   |
| quality           | STRING  | NOT NULL               | Action quality rating |
| timestamp         | DATE    | NOT NULL               | Action timestamp      |
| area              | STRING  | NOT NULL               | Court/field area      |
| setNumber         | INTEGER | NOT NULL, MIN 1, MAX 5 | Set number (1-5)      |
| scoreTeamAnalyzed | INTEGER | NOT NULL               | Analyzed team score   |
| scoreTeamOther    | INTEGER | NOT NULL               | Opponent team score   |
| rotation          | STRING  | NULL                   | Player rotation       |

**Indexes**: Unique index on (timestamp, scriptId)

### complexes

**Purpose**: Action complexes/combinations

| Column | Type    | Constraints            | Description                        |
| ------ | ------- | ---------------------- | ---------------------------------- |
| id     | INTEGER | PK, Auto Increment     | Primary key                        |
| type   | STRING  | NOT NULL, REGEX /^K.+/ | Complex type (must start with 'K') |

## Relationship/Contract Tables

### contractUserAction

**Purpose**: Links users to actions they've analyzed

| Column    | Type    | Constraints        | Description          |
| --------- | ------- | ------------------ | -------------------- |
| id        | INTEGER | PK, Auto Increment | Primary key          |
| userId    | INTEGER | NOT NULL           | Reference to user    |
| actionId  | INTEGER | NOT NULL           | Reference to action  |
| sessionId | INTEGER | NOT NULL           | Reference to session |

**Indexes**: Unique index on (userId, actionId)

### contractTeamPlayer

**Purpose**: Links players to teams with role information

| Column               | Type    | Constraints        | Description            |
| -------------------- | ------- | ------------------ | ---------------------- |
| id                   | INTEGER | PK, Auto Increment | Primary key            |
| playerId             | INTEGER | NOT NULL           | Reference to player    |
| teamId               | INTEGER | NOT NULL           | Reference to team      |
| shirtNumber          | INTEGER | NULL               | Player's jersey number |
| position             | STRING  | NULL               | Playing position       |
| positionAbbreviation | STRING  | NULL               | Position abbreviation  |
| role                 | STRING  | NULL               | Player's role on team  |

### contractTeamUser

**Purpose**: Links users to teams with permission levels

| Column      | Type    | Constraints             | Description           |
| ----------- | ------- | ----------------------- | --------------------- |
| id          | INTEGER | PK, Auto Increment      | Primary key           |
| userId      | INTEGER | NOT NULL                | Reference to user     |
| teamId      | INTEGER | NOT NULL                | Reference to team     |
| isSuperUser | BOOLEAN | NOT NULL, DEFAULT false | Super user privileges |
| isAdmin     | BOOLEAN | NOT NULL, DEFAULT false | Admin privileges      |
| isCoach     | BOOLEAN | NOT NULL, DEFAULT false | Coach privileges      |

### contractLeagueTeam

**Purpose**: Links teams to leagues

| Column   | Type    | Constraints        | Description         |
| -------- | ------- | ------------------ | ------------------- |
| id       | INTEGER | PK, Auto Increment | Primary key         |
| leagueId | INTEGER | NOT NULL           | Reference to league |
| teamId   | INTEGER | NOT NULL           | Reference to team   |

### contractPlayerUser

**Purpose**: One-to-one mapping between players and users

| Column   | Type    | Constraints        | Description         |
| -------- | ------- | ------------------ | ------------------- |
| id       | INTEGER | PK, Auto Increment | Primary key         |
| playerId | INTEGER | NOT NULL, UNIQUE   | Reference to player |
| userId   | INTEGER | NOT NULL, UNIQUE   | Reference to user   |

### contractVideoAction

**Purpose**: Links actions to video timestamps

| Column             | Type    | Constraints        | Description            |
| ------------------ | ------- | ------------------ | ---------------------- |
| id                 | INTEGER | PK, Auto Increment | Primary key            |
| actionId           | INTEGER | NOT NULL           | Reference to action    |
| videoId            | INTEGER | NULL               | Reference to video     |
| deltaTimeInSeconds | FLOAT   | NULL, DEFAULT 0.0  | Time offset in seconds |

## Specialized Tables

### opponentServeTimestamps

**Purpose**: Tracks opponent serve timing data

| Column              | Type    | Constraints        | Description                |
| ------------------- | ------- | ------------------ | -------------------------- |
| id                  | INTEGER | PK, Auto Increment | Primary key                |
| actionId            | INTEGER | NOT NULL           | Reference to action        |
| timestampServiceOpp | DATE    | NOT NULL           | Opponent service timestamp |
| serveType           | INTEGER | NOT NULL           | Type of serve              |

### pendingInvitations

**Purpose**: Manages team invitation workflow

| Column | Type    | Constraints        | Description           |
| ------ | ------- | ------------------ | --------------------- |
| id     | INTEGER | PK, Auto Increment | Primary key           |
| email  | STRING  | NOT NULL           | Invitee email address |
| teamId | INTEGER | NOT NULL           | Reference to team     |

## Key Relationships

### Core Entity Relationships

- **Users ↔ Teams**: Many-to-many through `contractTeamUser`
- **Players ↔ Teams**: Many-to-many through `contractTeamPlayer`
- **Players ↔ Users**: One-to-one through `contractPlayerUser`
- **Leagues ↔ Teams**: Many-to-many through `contractLeagueTeam`

### Session and Content Flow

- **Teams** → **Sessions** (one-to-many)
- **Sessions** → **Videos** (one-to-many)
- **Sessions** → **Scripts** (one-to-many)
- **Scripts** → **Actions** (one-to-many)

### Analysis Relationships

- **Users ↔ Actions**: Many-to-many through `contractUserAction`
- **Actions ↔ Videos**: Many-to-many through `contractVideoAction`
- **Actions** → **OpponentServeTimestamps** (one-to-many)
- **Complexes** → **Actions** (one-to-many)

## Database Features

- **Timestamps**: Most tables include automatic `createdAt` and `updatedAt` timestamps
- **Cascading Deletes**: Foreign key relationships include CASCADE options to maintain referential integrity
- **Unique Constraints**: Critical combinations like user-action pairs are enforced with unique indexes
- **Validation**: Data validation includes range checks (e.g., setNumber 1-5) and pattern matching (e.g., complex types)

## Usage Notes

- All ID fields are auto-incrementing integers starting from 1
- The system uses snake_case for table names and camelCase for column names
- Boolean fields default to `false` where applicable
- File paths and URLs are stored as strings with nullable constraints
- Timestamps are stored as DATE types and can include time components
