/** The position of the concerned device at a given time. The position, represented by a Coordinates object, comprehends the 2D position of the device, on a spheroid representing the Earth, but also its altitude and its speed.
 * @experimental
 */
export interface Position {
    readonly coords: Coordinates;
    readonly timestamp: number;
}
/** The position and altitude of the device on Earth, as well as the accuracy with which these properties are calculated.
 * @experimental
 */
export interface Coordinates {
    readonly accuracy: number;
    readonly altitude: number | null;
    readonly altitudeAccuracy: number | null;
    readonly heading: number | null;
    readonly latitude: number;
    readonly longitude: number;
    readonly speed: number | null;
}

/**
 * Position resolved by Geolocation browser API including location mapped by platform (via PosAPI).
 * @experimental
 */
export interface GeolocationPosition extends Position {
    readonly mappedLocation: MappedGeolocation | null;
}

/**
 * Location mapped by platform (via PosAPI) from a position resolved by Geolocation browser API.
 * @experimental
 */
export interface MappedGeolocation {
    readonly locationId: string | null;
    readonly locationName: string | null;
    readonly city: string | null;
    readonly state: string | null;
    readonly zip: string | null;
    readonly country: string | null;
    readonly cityClient: string | null;
    readonly countryClient: string | null;
    readonly locationNameClient: string | null;
    readonly postCodeClient: string | null;
    readonly stateClient: string | null;
}
