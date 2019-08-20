import { App } from '@slack/bolt';
import { WebAPICallResult } from '@slack/web-api';
import { newRequest } from '../approvalLogic';
const uToken = "";//replace with the Slack access token
const signSecret = ""; //replace with the Slack signing secret
//Allows Bolt to be used with only a user token and not a bot token
const authorizeFn = async () => {
    return {
        userToken: uToken,
    }
}
// Initializes your app with your signing secret
const boltApp = new App({
    signingSecret: signSecret,
    authorize: authorizeFn,
    ignoreSelf: false
});

boltApp.event('app_requested', ({ event }) => {
    newRequest(event);
});

interface AdminAppsRequestsListResult extends WebAPICallResult {
    app_requests: any[];
}

// get all outstanding requests from a team
export let pullRequests = async (team: string) => {
    try {
        // Call the admin.apps.requests.list
        const result = await boltApp.client.apiCall("admin.apps.requests.list", {
            token: uToken,
            team_id: team,
            limit: 1000
        }) as AdminAppsRequestsListResult;
        result.app_requests.forEach(async (request) => {
            let newAppRequest = { app_request: request }
            await newRequest(newAppRequest);
        });
    }
    catch (error) {
        console.error(error);
    }
}

export let approveRequest = async (team: string, request_id: string) => {
    try {
        // Call the admin.apps.requests.list
        const result = await boltApp.client.apiCall("admin.apps.approve", {
            token: uToken,
            team_id: team,
            limit: 1000,
            request_id
        });
    }
    catch (error) {
        console.error(error);
    }
}

export let rejectRequest = async (team: string, request_id: string) => {
    try {
        // Call the admin.apps.requests.list
        const result = await boltApp.client.apiCall("admin.apps.restrict", {
            token: uToken,
            team_id: team,
            limit: 1000,
            request_id
        });
    }
    catch (error) {
        console.error(error);
    }
}

export let approveApp = async (team: string, app_id: string) => {
    try {
        // Call the admin.apps.requests.list
        const result = await boltApp.client.apiCall("admin.apps.approve", {
            token: uToken,
            team_id: team,
            limit: 1000,
            app_id
        });
    }
    catch (error) {
        console.error(error);
    }
}

export let restrictApp = async (team: string, app_id: string) => {
    try {
        // Call the admin.apps.requests.list
        const result = await boltApp.client.apiCall("admin.apps.restrict", {
            token: uToken,
            team_id: team,
            limit: 1000,
            app_id
        });
    }
    catch (error) {
        console.error(error);
    }
}

(async () => {
    // Start your app
    await boltApp.start(process.env.PORT || 4000);
    console.log('Listening on port 4000 (⚡️ Bolt app is running');
})();