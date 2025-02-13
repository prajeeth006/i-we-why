#nullable enable

using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace Frontend.Vanilla.Content.Menus;

/// <summary>
/// Flat menu structure factory for generating data for menus that are easily convertible to JSON.
/// </summary>
public interface IMenuFactory
{
    /// <summary>
    /// Gets sections for a menu.
    ///
    /// Expected content structure:
    /// - path
    ///   - Section1
    ///     - Item1
    ///     - Item2
    ///   - Section2
    ///     - Item3
    /// </summary>
    [SuppressMessage("ReSharper", "SA1629", Justification = "Example structure.")]
    Task<IReadOnlyList<MenuSection>> GetSectionsAsync(DocumentId path, DslEvaluation dslEvaluation, CancellationToken cancellationToken);

    /// <summary>
    /// Gets a single section of a menu.
    /// </summary>
    Task<MenuSection?> GetSectionAsync(DocumentId path, DslEvaluation dslEvaluation, CancellationToken cancellationToken);

    /// <summary>
    /// Gets a single section of a menu.
    /// </summary>
    Task<MenuSection?> GetOptionalSectionAsync(DocumentId path, DslEvaluation dslEvaluation, CancellationToken cancellationToken);

    /// <summary>
    /// Gets tree of menu items.
    /// </summary>
    Task<MenuItem?> GetItemAsync(DocumentId path, DslEvaluation dslEvaluation, CancellationToken cancellationToken);

    /// <summary>
    /// Gets tree of optional menu items. Won't log error in case not found.
    /// </summary>
    Task<MenuItem?> GetOptionalItemAsync(DocumentId path, DslEvaluation dslEvaluation, CancellationToken cancellationToken);
}
