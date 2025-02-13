namespace Frontend.Vanilla.Features.LabelResolution;

internal enum LabelResolutionMode
{
    /// <summary>Resolution mode that resolves label from hostname end, i.e. www.bwin.com -> bwin.com</summary>
    HostnameEnd = 0,

    /// <summary>Resolution mode that resolves label from hostname start i.e. ladbrokes.com.dev.k8s.env.works -> ladbrokes.com</summary>
    HostnameStart = 1,
}
