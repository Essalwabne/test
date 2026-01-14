# Node.js Task Project

## Description
This project is a Node.js application built to practice server setup, database connection, and routing.  
It includes Express.js and examples for creating endpoints.

## Requirements
- Node.js (v18 or v20 recommended)
- npm installed
- MySQL database (required for database operations)

## Installation
```bash
npm install
```

## Environment Variables
You can configure the database connection using environment variables:
- `DB_HOST` - Database host (default: localhost)
- `DB_USER` - Database user (default: root)
- `DB_PASSWORD` - Database password (default: empty)
- `DB_NAME` - Database name (default: testdb)

## Running the Application
```bash
node app.js
```
The server will start on http://localhost:3000

## GitHub Workflows

This repository includes automated GitHub Actions workflows to help with development:

### 1. Node.js CI (`ci.yml`)
- **Triggers**: Push and pull requests to main branch
- **Purpose**: Continuous Integration testing
- **Actions**:
  - Tests the application on Node.js versions 18.x and 20.x
  - Installs dependencies
  - Runs security audit
  - Runs tests
  - Verifies the application starts successfully

### 2. Check PR Title (`checkTitle.yml`)
- **Triggers**: Pull request opened, edited, or synchronized
- **Purpose**: Ensures PR titles follow naming conventions
- **Requirement**: PR titles must start with "Task"

### 3. Dependency Review (`dependency-review.yml`)
- **Triggers**: Pull requests to main branch
- **Purpose**: Security review of dependency changes
- **Actions**:
  - Reviews new or updated dependencies
  - Checks for known security vulnerabilities
  - Comments on PR with findings
  - Fails on moderate or higher severity issues

