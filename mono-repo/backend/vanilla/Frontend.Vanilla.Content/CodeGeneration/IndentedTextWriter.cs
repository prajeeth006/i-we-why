using System;
using System.IO;
using System.Text;
using Frontend.Vanilla.Core.Utils;
using JetBrains.Annotations;

namespace Frontend.Vanilla.Content.CodeGeneration;

internal sealed class IndentedTextWriter : IDisposable
{
    private readonly StreamWriter writer;
    private readonly bool ownsStream;
    private readonly string indentation;
    private int indentationLevel;
    private bool firstInLine;

    /// <summary>
    /// Increment the indentation level.
    /// </summary>
    public void Indent()
    {
        indentationLevel++;
    }

    /// <summary>
    /// Decrement the indentation level.
    /// </summary>
    public void Unindent()
    {
        indentationLevel--;
    }

    /// <summary>
    /// Writes the specified text.
    /// </summary>
    /// <param name="text">The text to write.</param>
    public void Write(string text)
    {
        writer.Write(firstInLine ? GetIndentation() + text : text);
        firstInLine = false;
    }

    /// <summary>
    /// Writes the line.
    /// </summary>
    public void WriteLine()
    {
        writer.WriteLine();
        firstInLine = true;
    }

    /// <summary>
    /// Writes the line.
    /// </summary>
    /// <param name="text">The text to write.</param>
    public void WriteLine(string text)
    {
        writer.WriteLine(GetIndentation() + text);
        firstInLine = true;
    }

    /// <summary>
    /// Writes the line.
    /// </summary>
    /// <param name="text">The text to write.</param>
    /// <param name="parameters">The parameters to be substituted in the text.</param>
    public void WriteLine(string text, params object[] parameters)
    {
        writer.WriteLine(GetIndentation() + text, parameters);
        firstInLine = true;
    }

    private string GetIndentation()
    {
        var result = string.Empty;

        for (var i = 0; i < indentationLevel; ++i)
        {
            result += indentation;
        }

        return result;
    }

    /// <summary>
    /// Performs application-defined tasks associated with freeing, releasing, or resetting unmanaged resources.
    /// </summary>
    public void Dispose()
    {
        try
        {
            writer.Flush();
        }
        catch (ObjectDisposedException) { }

        if (ownsStream)
        {
            writer.Dispose();
        }
    }

    /// <summary>
    /// Initializes a new instance of the <see cref="IndentedTextWriter"/> class.
    /// </summary>
    /// <param name="targetStream">The target stream.</param>
    /// <param name="ownsStream">if set to <see langword="true"/> uses its own stream.</param>
    /// <param name="indentation">The indentation.</param>
    public IndentedTextWriter([NotNull] Stream targetStream, bool ownsStream = false, [NotNull] string indentation = "    ")
    {
        Guard.NotNull(targetStream, nameof(targetStream));
        Guard.NotNull(indentation, nameof(indentation));

        writer = new StreamWriter(targetStream, Encoding.ASCII);
        this.ownsStream = ownsStream;
        this.indentation = indentation;
    }
}
