export function isTeamCity() {
    return !!process.env.TEAMCITY_VERSION;
}
