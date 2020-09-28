import Vue from 'vue';

class NotificationService {
    loggedIn() {
        Vue.notify({
            type: 'success',
            title: 'Sign in',
            text: 'You are logged successfully'
        });
    }

    loggedOut() {
        Vue.notify({
            type: 'success',
            title: 'Sign out',
            text: 'You are logged out'
        });
    }

    created(thing) {
        Vue.notify({
            type: 'success',
            title: 'Success',
            text: 'Successfully created ' + thing
        });
    }

    updated(thing) {
        Vue.notify({
            type: 'success',
            title: 'Updated',
            text: 'Successfully updated ' + thing
        });
    }

    deleted(thing) {
        Vue.notify({
            type: 'success',
            title: 'Deleted',
            text: 'Successfully deleted ' + thing
        });
    }

    noAccessRights() {
        Vue.notify({
            type: 'error',
            title: 'No access rights',
            text: 'You can edit or delete only pending vacation requests'
        });
    }

    handleError(error) {
        if (!error.response.status) {
            return;
        }

        switch (error.response.status) {
            case 500:
                Vue.notify({
                    type: 'error',
                    title: 'Server error',
                    text: 'Sorry, error occur on our server, we re working on that ...'
                });

                break;

            case 422:
                Vue.notify({
                    type: 'error',
                    title: error.response.data.title ? error.response.data.title : 'Something went wrong',
                    text: error.response.data.message && error.response.data.message
                });

                break;

            case 404:
                Vue.notify({
                    type: 'error',
                    title: "Resource don't exists",
                    text: error.response.data.message && error.response.data.message
                });

                break;

            case 403:
                Vue.notify({
                    type: 'error',
                    title: 'No access rights',
                    text: 'Access refused, limited permissions'
                });

                break;

            case 401:
                Vue.notify({
                    type: 'error',
                    title: 'Unauthorized',
                    text: error.response.data.message && error.response.data.message
                });

                break;

            default:
                break;
        }
    }
}

export default NotificationService;
