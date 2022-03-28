// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.5.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.5.0/firebase-messaging-compat.js')

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
	apiKey: 'AIzaSyD6luQ46FnJxHg4tT8zvS3gzsPOJTEC1eQ',
	authDomain: 'whats-app-usna.firebaseapp.com',
	databaseURL: 'https://whats-app-usna-default-rtdb.firebaseio.com',
	projectId: 'whats-app-usna',
	storageBucket: 'whats-app-usna.appspot.com',
	messagingSenderId: '529286961549',
	appId: '1:529286961549:web:0112ba2aef31fa216f05c4',
	measurementId: 'G-LBB41MGGHH',
}

firebase.initializeApp(firebaseConfig)

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
	console.log('[firebase-messaging-sw.js] Received background message', payload)

	const notificationTitle = payload.notification.title
	const notificationOptions = {
		body: payload.notification.body,
		image: payload.notification.image,
		data: { url: `https://whats-app-usna.web.app/${payload.data.dept}/updates/${payload.data.uid}` },
	}

	self.registration.showNotification(notificationTitle, notificationOptions)
})

self.addEventListener('notificationclick', (event) => {
	event.notification.close()
	event.waitUntil(clients.openWindow(event.notification.data.url))
})
