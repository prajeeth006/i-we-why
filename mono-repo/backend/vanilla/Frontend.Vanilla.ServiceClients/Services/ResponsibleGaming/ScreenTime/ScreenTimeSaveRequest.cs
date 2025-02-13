using System;

namespace Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.ScreenTime;

/// <summary>
/// Contains infomation to save the Screen Time information.
/// </summary>
public sealed class ScreenTimeSaveRequest
{
#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
    public DateTime StartTime { get; set; }
    public DateTime ScreenTime { get; set; }
    public string Mac { get; set; }
#pragma warning restore CS1591 // Missing XML comment for publicly visible type or member
}
