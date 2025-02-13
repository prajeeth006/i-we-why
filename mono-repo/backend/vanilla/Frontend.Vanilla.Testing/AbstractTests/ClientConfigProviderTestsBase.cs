using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.ClientConfig;
using Frontend.Vanilla.Testing.Fakes;

#pragma warning disable 1591
namespace Frontend.Vanilla.Testing.AbstractTests;

public abstract class ClientConfigProviderTestsBase
{
    internal IClientConfigProvider Target { get; set; }
    internal CancellationToken Ct { get; set; } = TestCancellationToken.Get();

    protected async Task<IDictionary<string, object>> Target_GetConfigAsync()
    {
        var config = await Target.GetClientConfigAsync(Ct);

        return config != null
            ? GetDictionary(config).ToDictionary(k => k.Key.ToCamelCase(), k => k.Value) // Casing matters, same as on client
            : null;
    }

    private static Dictionary<string, object> GetDictionary(object values)
    {
        var dictionary = new Dictionary<string, object>(StringComparer.OrdinalIgnoreCase);
        AddValues();

        return dictionary;

        void AddValues()
        {
            if (values == null)
                return;

            foreach (PropertyDescriptor property in TypeDescriptor.GetProperties(values))
            {
                var obj = property.GetValue(values);
                dictionary.Add(property.Name, obj);
            }
        }
    }
}
#pragma warning restore 1591
