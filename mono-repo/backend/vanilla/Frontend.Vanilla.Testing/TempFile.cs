using System;
using System.IO;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Testing;

/// <summary>
///     Helpers for handling temp files in tests.
/// </summary>
internal static class TempFile
{
    public static void DeleteIfExists(string file)
    {
        if (string.IsNullOrWhiteSpace(file))
            return;

        // Also delete parent dir if it's a subdir of temp dir e.g. created by Create() method below
        var parentDir = Path.GetFullPath(Path.GetDirectoryName(file));
        var isTempSubdir = !string.Equals(parentDir.TrimEnd('\\'), Path.GetTempPath().TrimEnd('\\'), StringComparison.OrdinalIgnoreCase);

        if (File.Exists(file) && File.GetAttributes(file).HasFlag(FileAttributes.ReadOnly))
            File.SetAttributes(file, File.GetAttributes(file) & ~FileAttributes.ReadOnly);

        if (isTempSubdir && Directory.Exists(parentDir))
            Directory.Delete(parentDir, true);
        else if (!isTempSubdir && File.Exists(file))
            File.Delete(file);
    }

    public static RootedPath Get(
        string name = null,
        string text = null,
        byte[] bytes = null,
        bool createFile = true,
        bool createParentDir = true)
    {
        // Create in random subdir of temp dir to avoid collisions with other files
        var parentDir = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName());

        var file = new RootedPath(Path.Combine(parentDir, name ?? Path.GetRandomFileName()));

        if (createParentDir)
            Directory.CreateDirectory(parentDir);

        if (createFile && createParentDir)
        {
            File.WriteAllBytes(file, bytes ?? text?.EncodeToBytes() ?? Array.Empty<byte>());
        }

        return file;
    }
}
