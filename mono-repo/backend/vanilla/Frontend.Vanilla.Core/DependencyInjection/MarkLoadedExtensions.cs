using System.Linq;
using Frontend.Vanilla.Core.System.Text;
using Microsoft.Extensions.DependencyInjection;

namespace Frontend.Vanilla.Core.DependencyInjection;

/// <summary>
/// Extensions for loading some services only once by marking them as already loaded.
/// </summary>
internal static class MarkLoadedExtensions
{
    public static bool TryMarkAsLoaded(this IServiceCollection services, TrimmedRequiredString name)
    {
        if (services.Any(s => s.ImplementationInstance is Mutex m && m.Name == name))
            return false;

        services.AddSingleton(new Mutex(name));

        return true;
    }

    private sealed class Mutex(string name)
    {
        public string Name { get; } = name;
    }
}
