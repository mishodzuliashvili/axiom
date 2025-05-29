# Axiom: Real-time Collaborative Encrypted Workspace
## Capstone Progress Report - May 2025

---

### Project Information
- **Team Members:**
  - **Misho Dzuliashvili** - Full Stack Engineer
  - **Luka Trapaidze** - Frontend & UI/UX
  - **Luka Oniani** - Backend & Infrastructure Engineer
- **Program:** Computer Science
- **Supervisor:** Vasili Nikolaev
- **Report Date:** May 29, 2025

---

## Abstract

In an era of increasing digital surveillance and data breaches, secure collaboration tools are essential for teams handling sensitive information. We developed Axiom, a real-time collaborative workspace that prioritizes privacy through end-to-end encryption. Using a hybrid encryption model (RSA-OAEP for key exchange and AES-GCM for data encryption), Axiom ensures that only authorized users can access shared content, even if server infrastructure is compromised. The system enables real-time synchronization via WebSockets while maintaining client-side encryption, allowing teams to collaborate on documents with the same fluidity as traditional platforms but with cryptographic guarantees of privacy. Our implementation includes role-based access control, secure workspace management, and real-time collaborative editing of markdown files. The modular architecture supports future expansion to additional document types and enhanced collaboration features. This project demonstrates that secure, privacy-preserving collaboration can be achieved without sacrificing user experience or real-time functionality.

---

## Executive Summary

Axiom is a real-time collaborative workspace that provides end-to-end encryption for teams working with sensitive information. This progress report covers the development work completed through April 2025. The core encryption infrastructure, user authentication, and real-time collaboration features are now functional. Our immediate focus for June 2025 is implementing file persistence to the database and adding live markdown preview capabilities.

---

## 1. Project Overview

### 1.1 Objectives
**Primary Goal:** Build a secure, real-time collaborative workspace with end-to-end encryption

**Current Focus Areas:**
- Implement file saving to database
- Add live markdown preview
- Improve user experience for collaborative editing

### 1.2 Technical Approach
We use a hybrid encryption model combining RSA-OAEP for key exchange and AES-GCM for data encryption. All encryption happens client-side, ensuring the server never has access to plaintext data. Even though all data is encrypted, we implemented JWT authentication to prevent unauthorized access to encrypted file metadata and reduce server load from spam requests.

---

## 2. Progress to Date

### 2.1 Completed Features

**Authentication System**
- ✅ Username-based registration (no email required)
- ✅ Client-side RSA key pair generation
- ✅ Secure login flow with encrypted token verification
- ✅ JWT-based session management for API protection

**Workspace Management**
- ✅ Create and manage collaborative workspaces
- ✅ Invite users by username
- ✅ Role-based permissions (MANAGE_USERS permission implemented)
- ✅ AES-256 workspace key generation and distribution

**Real-time Collaboration**
- ✅ WebSocket infrastructure for live synchronization
- ✅ Encrypted patch transmission between clients
- ✅ Multiple users can edit the same file simultaneously
- ✅ Real-time cursor tracking and user presence

**File Operations**
- ✅ Create new markdown files
- ✅ Open existing files from workspace
- ✅ Real-time editing with immediate synchronization
- ❌ Save files to database (currently in-memory only)

### 2.2 Technical Implementation Details

**Security Flow Diagrams**
We have documented the security flows for core operations. These diagrams illustrate how encryption is integrated at every step:

<div style="margin: 30px 0;">
  <h4 style="text-align: center; color: #666; margin-bottom: 20px;">Authentication and Security Flows</h4>
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px;">
    <a href="/capstone_reports/april/flows/registration.svg" target="_blank" style="text-decoration: none; color: inherit;">
      <div style="text-align: center; background: rgba(128, 128, 128, 0.1); padding: 20px; border-radius: 8px; border: 1px solid rgba(128, 128, 128, 0.3); transition: transform 0.2s; cursor: pointer;">
        <img src="/capstone_reports/april/flows/registration.svg" alt="Registration Flow" style="width: 100%; height: 200px; object-fit: contain;">
        <p style="margin-top: 10px; font-weight: 600; color: #666;">Registration Flow</p>
        <p style="font-size: 14px; color: #888;">Client-side key generation</p>
      </div>
    </a>
    <a href="/capstone_reports/april/flows/login.svg" target="_blank" style="text-decoration: none; color: inherit;">
      <div style="text-align: center; background: rgba(128, 128, 128, 0.1); padding: 20px; border-radius: 8px; border: 1px solid rgba(128, 128, 128, 0.3); transition: transform 0.2s; cursor: pointer;">
        <img src="/capstone_reports/april/flows/login.svg" alt="Login Flow" style="width: 100%; height: 200px; object-fit: contain;">
        <p style="margin-top: 10px; font-weight: 600; color: #666;">Login Flow</p>
        <p style="font-size: 14px; color: #888;">Encrypted token verification</p>
      </div>
    </a>
    <a href="/capstone_reports/april/flows/create-workspace.svg" target="_blank" style="text-decoration: none; color: inherit;">
      <div style="text-align: center; background: rgba(128, 128, 128, 0.1); padding: 20px; border-radius: 8px; border: 1px solid rgba(128, 128, 128, 0.3); transition: transform 0.2s; cursor: pointer;">
        <img src="/capstone_reports/april/flows/create-workspace.svg" alt="Create Workspace Flow" style="width: 100%; height: 200px; object-fit: contain;">
        <p style="margin-top: 10px; font-weight: 600; color: #666;">Workspace Creation</p>
        <p style="font-size: 14px; color: #888;">AES key generation & distribution</p>
      </div>
    </a>
  </div>
</div>

**Example: Login Flow Implementation**
The login process demonstrates our security model. Users provide their username and private key. The server returns an encrypted JWT token that can only be decrypted with the user's private key:

```javascript
// Server sends encrypted token
const { encryptedToken, publicKey, userId } = response.data;

// Client decrypts with private key
const decryptedToken = await decryptWithPrivateKey(
  encryptedToken,
  privateKey
);

// Verification ensures proper authentication
const verificationResponse = await verifyAuth({
  userId,
  decryptedToken,
});
```

This approach ensures that even authentication tokens remain encrypted and inaccessible to potential attackers.

### 2.3 User Interface Progress

We have implemented a clean, intuitive interface for all core features:

<div style="margin: 30px 0;">
  <h4 style="text-align: center; color: #666; margin-bottom: 20px;">User Interface Screenshots</h4>

  <!-- Registration Process -->
  <div style="background: rgba(128, 128, 128, 0.05); padding: 30px; border-radius: 12px; margin-bottom: 30px; border: 1px solid rgba(128, 128, 128, 0.2);">
    <h5 style="color: #555; margin-bottom: 20px;">Registration Process</h5>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      <a href="/capstone_reports/april/images/registration-step-1.png" target="_blank" style="text-decoration: none; color: inherit;">
        <div style="text-align: center; background: rgba(128, 128, 128, 0.08); padding: 15px; border-radius: 8px; border: 1px solid rgba(128, 128, 128, 0.2); transition: transform 0.2s; cursor: pointer;">
          <img src="/capstone_reports/april/images/registration-step-1.png" alt="Registration Step 1" 
               style="width: 100%; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
          <p style="margin-top: 10px; font-weight: 600; color: #666;">Step 1: Username Entry</p>
          <p style="font-size: 14px; color: #888;">Simple registration with username only</p>
        </div>
      </a>
      <a href="/capstone_reports/april/images/registration-step-2.png" target="_blank" style="text-decoration: none; color: inherit;">
        <div style="text-align: center; background: rgba(128, 128, 128, 0.08); padding: 15px; border-radius: 8px; border: 1px solid rgba(128, 128, 128, 0.2); transition: transform 0.2s; cursor: pointer;">
          <img src="/capstone_reports/april/images/registration-step-2.png" alt="Registration Step 2" 
               style="width: 100%; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
          <p style="margin-top: 10px; font-weight: 600; color: #666;">Step 2: Key Generation</p>
          <p style="font-size: 14px; color: #888;">Client-side RSA key pair creation</p>
        </div>
      </a>
    </div>
    <div style="text-align: center; margin-top: 20px;">
      <a href="/capstone_reports/april/images/download-credentials.png" target="_blank" style="text-decoration: none; color: inherit;">
        <div style="display: inline-block; background: rgba(128, 128, 128, 0.08); padding: 15px; border-radius: 8px; border: 1px solid rgba(128, 128, 128, 0.2); transition: transform 0.2s; cursor: pointer;">
          <img src="/capstone_reports/april/images/download-credentials.png" alt="Download Credentials" 
               style="width: 100%; max-width: 500px; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
          <p style="margin-top: 10px; font-weight: 600; color: #666;">Credential Download</p>
          <p style="font-size: 14px; color: #888;">Secure private key storage with clear warnings</p>
        </div>
      </a>
    </div>
  </div>

  <!-- Workspace Management -->
  <div style="background: rgba(128, 128, 128, 0.05); padding: 30px; border-radius: 12px; margin-bottom: 30px; border: 1px solid rgba(128, 128, 128, 0.2);">
    <h5 style="color: #555; margin-bottom: 20px;">Workspace Management</h5>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      <a href="/capstone_reports/april/images/create-workspace.png" target="_blank" style="text-decoration: none; color: inherit;">
        <div style="text-align: center; background: rgba(128, 128, 128, 0.08); padding: 15px; border-radius: 8px; border: 1px solid rgba(128, 128, 128, 0.2); transition: transform 0.2s; cursor: pointer;">
          <img src="/capstone_reports/april/images/create-workspace.png" alt="Create Workspace" 
               style="width: 100%; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
          <p style="margin-top: 10px; font-weight: 600; color: #666;">Workspace Creation</p>
          <p style="font-size: 14px; color: #888;">Simple interface for new workspaces</p>
        </div>
      </a>
      <a href="/capstone_reports/april/images/manage-workspace.png" target="_blank" style="text-decoration: none; color: inherit;">
        <div style="text-align: center; background: rgba(128, 128, 128, 0.08); padding: 15px; border-radius: 8px; border: 1px solid rgba(128, 128, 128, 0.2); transition: transform 0.2s; cursor: pointer;">
          <img src="/capstone_reports/april/images/manage-workspace.png" alt="Manage Workspace" 
               style="width: 100%; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
          <p style="margin-top: 10px; font-weight: 600; color: #666;">Workspace Dashboard</p>
          <p style="font-size: 14px; color: #888;">File management and collaboration</p>
        </div>
      </a>
      <a href="/capstone_reports/april/images/upload-file.png" target="_blank" style="text-decoration: none; color: inherit;">
        <div style="text-align: center; background: rgba(128, 128, 128, 0.08); padding: 15px; border-radius: 8px; border: 1px solid rgba(128, 128, 128, 0.2); transition: transform 0.2s; cursor: pointer;">
          <img src="/capstone_reports/april/images/upload-file.png" alt="File Upload" 
               style="width: 100%; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
          <p style="margin-top: 10px; font-weight: 600; color: #666;">File Upload</p>
        </div>
      </a>
    </div>
  </div>

  <!-- User and File Management -->
  <div style="background: rgba(128, 128, 128, 0.05); padding: 30px; border-radius: 12px; border: 1px solid rgba(128, 128, 128, 0.2);">
    <h5 style="color: #555; margin-bottom: 20px;">Collaboration Features</h5>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      <a href="/capstone_reports/april/images/manage-users.png" target="_blank" style="text-decoration: none; color: inherit;">
        <div style="text-align: center; background: rgba(128, 128, 128, 0.08); padding: 15px; border-radius: 8px; border: 1px solid rgba(128, 128, 128, 0.2); transition: transform 0.2s; cursor: pointer;">
          <img src="/capstone_reports/april/images/manage-users.png" alt="Manage Users" 
               style="width: 100%; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
          <p style="margin-top: 10px; font-weight: 600; color: #666;">User Management</p>
          <p style="font-size: 14px; color: #888;">Invite and manage team members</p>
        </div>
      </a>
    </div>
  </div>
</div>

---

## 3. Current Development Status

### 3.1 In Progress
**File Persistence (Primary Focus)**
- Implementing save functionality to store files in PostgreSQL
- Files are currently only synchronized in-memory between active users
- Need to add both auto-save and manual save options
- Database schema is ready, but save logic needs implementation

### 3.2 Architecture Decisions

**Technology Stack**
- Frontend: Next.js 15, React 19, TypeScript
- Backend: Node.js with WebSocket support
- Database: PostgreSQL with Prisma ORM
- Security: Web Crypto API for client-side encryption

**Current Database Schema**
Files are stored directly in database columns (no block storage yet). Each file record includes:
- Encrypted content
- Workspace association
- Version metadata
- Access permissions

### 3.3 Database Schema Visual

<div style="background-color: #eee; padding: 1em; border-radius: 8px;">
  <img src="/capstone_reports/april/images/erd.svg" alt="ERD">
</div>

**WorkspaceUserPermission Enum:**
```prisma
enum WorkspaceUserPermission {
  ADD
  EDIT
  DELETE
  VIEW
  MANAGE_USERS
  CREATOR
}
```

---

## 4. Challenges and Solutions

### 4.1 Technical Challenges Resolved
1. **Web Crypto API Integration**: Successfully implemented client-side encryption despite the API's complexity
2. **Real-time Synchronization**: Balanced encryption overhead with performance requirements
3. **WebSocket State Management**: Maintained stable connections across multiple concurrent users

### 4.2 Current Limitations
- Files exist only in memory until save functionality is implemented
- No markdown preview (editing in plain text only)
- Private keys stored in browser localStorage
- No key rotation when users are removed from workspaces

---

## 5. Next Steps (June 2025)

### 5.1 Immediate Priorities
1. **File Persistence** (Week 1-2)
- Implement save-to-database functionality
- Add auto-save with configurable intervals
- Create manual save option with keyboard shortcuts

2. **Markdown Preview** (Week 3)
- Integrate markdown preview library
- Add split-screen editor/preview mode
- Ensure preview updates in real-time

3. **User Experience Improvements** (Week 4)
- Better error handling and user feedback
- Loading states for file operations
- Improved file management interface

### 5.2 Future Considerations
While not immediate priorities, we have identified these areas for future development:
- File versioning and history
- Enhanced permission granularity
- Support for additional file types
- Mobile application development

---

## 6. Risk Assessment

### Technical Risks
- **Data Loss**: Until save functionality is complete, files can be lost if all users disconnect
- **Mitigation**: Implementing file persistence is our top priority

### Security Considerations
- Future work needed on key rotation mechanisms

---

## 7. Conclusion

Axiom has successfully demonstrated that secure, real-time collaboration is achievable without sacrificing user experience. The core infrastructure is complete and functional. Our immediate focus for June 2025 is implementing file persistence and improving the editing experience with markdown preview. These features will make Axiom ready for beta testing with real users.

The project remains on track to deliver a privacy-focused collaboration platform that meets the needs of teams handling sensitive information.

---

## Appendices

### A. Technical Documentation
- Security flow diagrams available in `capstone_reports/april/flows/`
- API documentation in progress
- Deployment guide to be created