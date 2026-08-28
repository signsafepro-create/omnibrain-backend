# LIL.JR 2.0 — API Reference

## Authentication
| Method | Endpoint | Body | Auth | Response |
|--------|----------|------|------|----------|
| POST | /api/auth/register | {email, password, full_name, company_name?, phone?} | No | {token, user} |
| POST | /api/auth/login | {email, password} | No | {token, user} |
| POST | /api/auth/logout | — | Yes | {message} |
| GET | /api/auth/me | — | Yes | {user} |

## Brain (Make It Real)
| Method | Endpoint | Body | Auth | Response |
|--------|----------|------|------|----------|
| POST | /api/brain/create-project | {name, description?, project_type?} | Yes | {project, agents[11]} |
| POST | /api/brain/build/:id | — | Yes | {message, status, project_id} |
| GET | /api/brain/projects | — | Yes | {projects[]} |

## Website (One-Second Site)
| Method | Endpoint | Body | Auth | Response |
|--------|----------|------|------|----------|
| POST | /api/website/generate | {name, description?, template_type?} | Yes | {website, preview_url} |
| GET | /api/website/list | — | Yes | {websites[]} |
| GET | /api/website/:id/preview | — | Yes | HTML |

## Email (Signal Fire)
| Method | Endpoint | Body | Auth | Response |
|--------|----------|------|------|----------|
| POST | /api/email/campaign/create | {name, subject, body, recipient_list[]} | Yes | {campaign} |
| POST | /api/email/campaign/:id/send | — | Yes | {message, campaign_id} |

## Dashboard (Command Deck)
| Method | Endpoint | Auth | Response |
|--------|----------|------|----------|
| GET | /api/dashboard/overview | Yes | {projects, websites, email_campaigns, agents, chatbots} |
| GET | /api/dashboard/search?q= | Yes | {results[]} |

## Phone (Direct Line)
| Method | Endpoint | Body | Auth | Response |
|--------|----------|------|------|----------|
| POST | /api/phone/sms/send | {to, message} | Yes | {message, log} |

## Chatbot (Talk Engine)
| Method | Endpoint | Body | Auth | Response |
|--------|----------|------|------|----------|
| POST | /api/chatbot/create | {name, welcome_message?, phone_number?} | Yes | {chatbot} |
| POST | /api/chatbot/:id/chat | {message} | Yes | {response, chatbot_id} |

## System
| Method | Endpoint | Auth | Response |
|--------|----------|------|----------|
| GET | /health | No | {status, version, timestamp} |
| WS | /ws/notifications?token= | Yes | Real-time push |
