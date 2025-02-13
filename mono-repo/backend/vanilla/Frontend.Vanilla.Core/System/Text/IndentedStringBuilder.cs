using System;
using System.Text;

namespace Frontend.Vanilla.Core.System.Text;

/// <summary>
/// Wraps <see cref="StringBuilder" /> and indents all lines accordingly. Useful for code generation.
/// </summary>
internal sealed class IndentedStringBuilder
{
    private readonly StringBuilder inner = new StringBuilder();
    private int indent;

    public IndentedStringBuilder AppendLine(string? line = null)
    {
        if (line != null && !string.IsNullOrWhiteSpace(line))
            AppendLineWithIndent(line);
        else
            inner.AppendLine();

        return this;
    }

    /// <summary>Useful to merge existing multiline code.</summary>
    public IndentedStringBuilder AppendLines(string lines)
    {
        foreach (var line in lines.TrimEnd().Split(new[] { Environment.NewLine }, default))
            AppendLineWithIndent(line);

        return this;
    }

    private void AppendLineWithIndent(string line)
        => inner.Append(' ', 4 * indent).AppendLine(line);

    public IndentedStringBuilder Indent()
    {
        indent++;

        return this;
    }

    public IndentedStringBuilder Unindent()
    {
        indent = indent > 0 ? indent - 1 : throw new InvalidOperationException("Indent is already zero.");

        return this;
    }

    public override string ToString()
        => inner.ToString();
}
