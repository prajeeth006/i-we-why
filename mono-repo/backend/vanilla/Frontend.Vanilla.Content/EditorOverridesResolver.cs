namespace Frontend.Vanilla.Content;

/// <summary>
/// Resolves current <see cref="EditorOverrides" />.
/// </summary>
internal interface IEditorOverridesResolver
{
    EditorOverrides Resolve();
}

internal sealed class DefaultEditorOverridesResolver : IEditorOverridesResolver
{
    private readonly EditorOverrides instance = new EditorOverrides();
    public EditorOverrides Resolve() => instance;
}
