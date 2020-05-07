'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})
Route.post('/signup', 'UserController.signup')
Route.post('/login', 'UserController.login')
// this is just a sample for demonstration
Route.get('/sample', 'SampleController.profile').middleware(['auth:jwt'])
Route.get('/userinfo', 'UserController.getUser').middleware(['auth:jwt'])
Route.get('/getMentors', 'UserController.getMentors')
Route.post('/createMessage', 'MessageController.createMessage')
Route.get('/showMessage', 'MessageController.showMessage')
Route.post('/createApply', 'ApplyController.createApply')
Route.get('/getApplies', 'ApplyController.getApplies')
Route.post('/agreeApply', 'ApplyController.agreeApply')
Route.post('/rejectApply', 'ApplyController.rejectApply')
Route.get('/homeDashboard', 'TestController.homeDashboard')
Route.get('/cpuUsageData', 'DashboardController.cpuUsageData')
