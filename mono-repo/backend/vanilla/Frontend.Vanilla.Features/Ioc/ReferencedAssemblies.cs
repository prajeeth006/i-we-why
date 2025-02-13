using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Reflection;

namespace Frontend.Vanilla.Features.Ioc;

/// <summary>
/// List of referenced assemblies.
/// </summary>
internal sealed class ReferencedAssemblies(IEnumerable<Assembly> assemblies) : ReadOnlyCollection<Assembly>(assemblies.ToArray()) { }
