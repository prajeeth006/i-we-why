using System;
using System.Collections.Generic;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.IO;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;

internal static class TestSettings
{
    public static DynaConParameter GetParameter()
        => new DynaConParameter(DynaConParameter.ServiceName, "Test:1");

    public static DynaConEngineSettingsBuilder GetBuilder(Action<DynaConEngineSettingsBuilder> configure = null)
    {
        var builder = new DynaConEngineSettingsBuilder(GetParameter());
        configure?.Invoke(builder);

        return builder;
    }

    public static DynaConEngineSettings Get(Action<DynaConEngineSettingsBuilder> configure = null)
        => GetBuilder(configure).Build();

    public static TenantSettings GetTenant(RootedPath changesetFallbackFile = null, RootedPath localOverridesFile = null, IEnumerable<DynaConParameter> parameters = null)
        => new TenantSettings("test", changesetFallbackFile, localOverridesFile, parameters ?? new[] { GetParameter() });
}
