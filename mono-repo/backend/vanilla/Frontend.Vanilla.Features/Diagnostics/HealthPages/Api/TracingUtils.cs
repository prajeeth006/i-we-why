namespace Frontend.Vanilla.Features.Diagnostics.HealthPages.Api
{
    /// <summary>
    /// Utilities used with open telemetry tracing.
    /// </summary>
    internal static class TracingUtils
    {
        /// <summary>
        /// Tracing service name in jager will be mono-trace-{product}.
        /// </summary>
        public const string TraceServiceName = "mono-trace-";

        /// <summary>
        /// Tracing span activity name for recording traces from refreshing health/log page that will be rec-{product}.
        /// </summary>
        public const string TraceSpanActivity = "rec-";
    }
}
