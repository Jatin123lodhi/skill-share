# SkillShare

A full-stack course marketplace platform where instructors can create and manage courses, and students can enroll, learn, and review courses.

## Project Overview

SkillShare is a modern e-learning platform that connects instructors with students. The platform enables instructors to create courses with categories, pricing, and descriptions, while students can browse courses, enroll in them, and leave reviews. The system maintains course ratings, manages enrollments, and provides role-based access control to ensure proper authorization.

**Key Features:**
- User authentication and authorization (Student/Instructor roles)
- Course creation and management
- Course browsing with filtering and pagination
- Enrollment system
- Review and rating system with automatic average calculation
- Role-based access control (RBAC)

## Tech Stack

### Backend
- **Runtime**: Bun
- **Framework**: Express.js 5.x
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Security**: express-rate-limit for rate limiting
- **CORS**: Enabled for cross-origin requests

### Frontend
- **Framework**: React 19.x
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS 4.x
- **State Management**: Zustand
- **Routing**: React Router DOM 7.x
- **HTTP Client**: Axios

### Infrastructure
- **Database**: MongoDB (containerized with Docker Compose)
- **Containerization**: Docker & Docker Compose

## API Highlights

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user (with rate limiting)
- `POST /api/auth/login` - Login and receive JWT token
- `GET /api/auth/me` - Get current authenticated user (protected)

### Course Endpoints
- `POST /api/courses` - Create a new course (requires instructor role)
- `GET /api/courses` - Get paginated list of courses with filtering
  - Query params: `page`, `limit`, `category`, `minRating`, `sort` (oldest/latest)
- `POST /api/courses/:courseId/enroll` - Enroll in a course (requires student role)
- `POST /api/courses/:courseId/review` - Submit a review (requires student role, must be enrolled)
- `GET /api/courses/:courseId/review` - Get paginated reviews for a course

### Health Check
- `GET /health` - Server health status

**API Features:**
- Pagination support with metadata (page, limit, hasNext)
- Filtering by category and minimum rating
- Sorting by creation date (latest/oldest)
- Comprehensive error handling
- Input validation
- Rate limiting on authentication endpoints

## Auth Flow

### Registration Flow
1. User submits email, password, name, and optional role
2. Server validates email format and password strength (min 6 characters)
3. Checks for existing user with same email
4. Password is hashed using bcrypt (10 salt rounds)
5. User document is created in MongoDB
6. Response returns user data (excluding password)

### Login Flow
1. User submits email and password
2. Server finds user by email (including password field)
3. Password is verified using bcrypt.compare()
4. JWT token is generated containing userId, email, and role
5. Token expires in 7 days
6. Response includes token and user data

### Protected Route Flow
1. Client includes JWT token in `Authorization: Bearer <token>` header
2. `authMiddleware` extracts and verifies token
3. Decoded token data (userId, email, role) is attached to `req.user`
4. Route handler accesses user information from `req.user`
5. `requireRole` middleware enforces role-based access (student/instructor)

### Security Features
- Passwords are never returned in API responses (select: false in schema)
- JWT tokens contain minimal necessary information
- Rate limiting on authentication endpoints to prevent brute force
- Role-based middleware for endpoint protection
- Password hashing with bcrypt

## Schema Decisions

### User Schema
```typescript
{
  email: String (unique, required),
  password: String (required, select: false),
  name: String (optional),
  role: String (enum: ["student", "instructor"], default: "student"),
  timestamps: true
}
```
**Decisions:**
- Email as unique identifier (no separate username)
- Password excluded from default queries for security
- Role-based access control with enum validation
- Timestamps for audit trail

### Course Schema
```typescript
{
  title: String (unique, required),
  description: String (required),
  category: String (required),
  price: Number (required),
  ratingAvg: Number (default: 0),
  instructorId: ObjectId (ref: User, required),
  timestamps: true
}
```
**Decisions:**
- Title uniqueness enforced at schema level
- Denormalized `ratingAvg` for faster queries (updated on review creation)
- Reference to User for instructor relationship
- Category stored as string (could be normalized in future)

### Enrollment Schema
```typescript
{
  courseId: ObjectId (ref: Course, required),
  userId: ObjectId (ref: User, required),
  enrolledAt: Date (default: Date.now)
}
```
**Decisions:**
- Separate collection for many-to-many relationship
- Tracks enrollment timestamp
- Compound unique index prevents duplicate enrollments

### Review Schema
```typescript
{
  userId: ObjectId (ref: User, required),
  courseId: ObjectId (ref: Course, required),
  comment: String (required, maxLength: 500),
  rating: Number (min: 1, max: 5, required),
  timestamps: true
}
```
**Decisions:**
- One review per user per course (enforced by unique compound index)
- Comment length limit prevents abuse
- Rating constrained to 1-5 integer scale
- Timestamps for chronological sorting

## Indexing Choices

### Course Collection
- **`{ category: 1 }`** - Optimizes filtering by category in course listings
- **`{ createdAt: -1 }`** - Optimizes sorting by newest courses (default sort)

**Rationale:**
- Category filtering is a common query pattern
- Most users want to see newest courses first
- Rating-based index commented out (can be added if sorting by rating becomes common)

### Enrollment Collection
- **`{ userId: 1, courseId: 1 }` (unique)** - Prevents duplicate enrollments and optimizes enrollment checks

**Rationale:**
- Compound unique index ensures data integrity
- Fast lookup for "is user enrolled?" queries
- Supports enrollment validation before review creation

### Review Collection
- **`{ userId: 1, courseId: 1 }` (unique)** - Ensures one review per user per course
- **`{ courseId: 1, createdAt: -1 }`** - Optimizes fetching reviews for a course sorted by newest

**Rationale:**
- Unique constraint prevents review spam
- Compound index supports the most common query pattern: "get reviews for course X, newest first"
- Efficient for pagination of course reviews

**Indexing Strategy:**
- Indexes chosen based on actual query patterns
- Compound indexes support multi-field queries
- Unique indexes enforce business rules
- Read optimization prioritized (reviews fetched more often than written)

## Trade-offs

### 1. Denormalized Rating Average
**Decision**: Store `ratingAvg` directly on Course document  
**Trade-off**: 
- ✅ Faster course listing queries (no aggregation needed)
- ✅ Simpler API responses
- ❌ Must recalculate on every review creation/update
- ❌ Potential for slight inconsistency if aggregation fails

**Mitigation**: Rating recalculation happens synchronously during review creation

### 2. Role in Registration
**Decision**: Allow role selection during registration  
**Trade-off**:
- ✅ Faster onboarding for instructors
- ❌ Security risk if not properly validated
- **Note**: Code comments indicate this should be removed (TODO)

**Better Approach**: Default all users to "student", require admin approval or separate flow for instructor status

### 3. Password Strength
**Decision**: Minimum 6 characters  
**Trade-off**:
- ✅ Lower barrier to entry
- ❌ Weaker security than industry standard (8+ chars, complexity requirements)

**Recommendation**: Increase to 8+ characters with complexity requirements

### 4. JWT Expiration
**Decision**: 7-day token expiration  
**Trade-off**:
- ✅ Better user experience (less frequent logins)
- ❌ Longer window for token compromise
- ❌ No refresh token mechanism

**Recommendation**: Implement refresh tokens for better security

### 5. Pagination vs Infinite Scroll
**Decision**: Page-based pagination  
**Trade-off**:
- ✅ Predictable API behavior
- ✅ Easy to implement on frontend
- ❌ Less modern UX compared to infinite scroll
- ✅ Better for SEO and bookmarking

### 6. MongoDB vs SQL Database
**Decision**: MongoDB (NoSQL)  
**Trade-off**:
- ✅ Flexible schema for course metadata
- ✅ Easy to add new fields
- ✅ Good for document-based data
- ❌ No joins (requires populate or multiple queries)
- ❌ Less strict referential integrity

**Mitigation**: Mongoose provides populate() for relationships, but requires careful design

### 7. Rate Limiting Scope
**Decision**: Rate limiting only on auth endpoints  
**Trade-off**:
- ✅ Protects against brute force attacks
- ✅ Reduces server load on expensive operations
- ❌ Other endpoints vulnerable to abuse

**Recommendation**: Add rate limiting to course creation and review endpoints

### 8. Error Handling
**Decision**: Centralized error handler middleware  
**Trade-off**:
- ✅ Consistent error responses
- ✅ Easier to maintain
- ❌ May expose internal details if not careful

**Current State**: Error handler exists but should be reviewed for information leakage

### 9. Course Title Uniqueness
**Decision**: Enforce unique course titles  
**Trade-off**:
- ✅ Prevents confusion
- ❌ Limits instructor creativity
- ❌ May cause conflicts with similar course names

**Alternative**: Use unique slug/URL instead, allow similar titles

### 10. Review Requirement
**Decision**: Must be enrolled to review  
**Trade-off**:
- ✅ Ensures reviews from actual students
- ✅ Higher quality reviews
- ❌ Prevents potential customers from seeing reviews before enrolling

**Alternative**: Allow reviews from non-enrolled users but mark them differently

