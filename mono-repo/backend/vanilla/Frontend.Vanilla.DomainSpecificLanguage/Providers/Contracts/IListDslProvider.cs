using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides access to lists on PosAPI.
/// </summary>
[Description("Provides access to lists on PosAPI.")]
public interface IListDslProvider
{
    /// <summary>
    /// Determines if specified named list on PosAPI contains given string value.
    /// </summary>
    [Description(
        "Determines if specified named list retrieved from PosAPI database contains given string value which can be another DSL expression." +
        " Lists can be managed in PosAPI admin web e.g. http://admin.api.prod.env.works/Settings/Lists for production.")]
    [ValueVolatility(ValueVolatility.Client)]
    Task<bool> ContainsAsync(ExecutionMode mode, string listName, string arg);
}
