-- <%= name %> entry point
print("Hello from <%= name %>, running under " .. (wax and wax.envname or "native Luau"))