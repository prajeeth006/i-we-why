using Frontend.Vanilla.Features.ClientConfig;

namespace Frontend.Vanilla.Features.TrackerId;

internal sealed class TrackerIdClientConfigProvider(ITrackerIdConfiguration config) : LambdaClientConfigProvider("vnTrackerId", () => config) { }
