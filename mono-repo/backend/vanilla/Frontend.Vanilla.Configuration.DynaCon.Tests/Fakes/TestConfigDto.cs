using System;
using System.Collections.Generic;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;

public static class TestConfigDto
{
    public static ConfigurationResponse Create(
        long id = 123,
        UtcDateTime? validFrom = null,
        IReadOnlyDictionary<string, IReadOnlyDictionary<string, KeyConfiguration>> configs = null,
        long? lastCommitId = null)
    {
        validFrom = validFrom ?? new UtcDateTime(2001, 4, 25, 10, 35, 45);
        configs = configs ?? new Dictionary<string, IReadOnlyDictionary<string, KeyConfiguration>>(StringComparer.OrdinalIgnoreCase)
        {
            [Guid.NewGuid().ToString()] = new Dictionary<string, KeyConfiguration>(StringComparer.OrdinalIgnoreCase)
            {
                [Guid.NewGuid().ToString()] = CreateKey(Guid.NewGuid().ToString()),
            },
        };

        return new ConfigurationResponse(id, validFrom.Value.Value, configs, lastCommitId);
    }

    public static KeyConfiguration CreateKey(object value = null)
        => new KeyConfiguration(Guid.NewGuid().ToString(), new[] { new ValueConfiguration(value) });
}
