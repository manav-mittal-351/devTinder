# DevTinder API's

authRouter
- POST /login
- POST /signUp
- POST /logout

profileRouter
- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

connectionRequestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignore/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

userRouter
- GET /user/connections
- GET /user/requests
- GET /user/feed --> Gets you the profiles of other users on platform

Status: ignoe, intrested, accepted, rejctedx